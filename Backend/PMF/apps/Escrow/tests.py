from django.test import TestCase
from django.contrib.auth import get_user_model  # Use this instead of User
from rest_framework.test import APIClient
from django.db import transaction
from apps.Transaction.models import MoneyTransfer, ForeignCurrencyRequest, Wallet, TransactionLog
from apps.Escrow.models import Escrow
from django.contrib.contenttypes.models import ContentType

User = get_user_model()  # Get the active user model (accounts.User)

class EscrowSignalTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpass')
        self.admin = User.objects.create_superuser(username='admin', password='adminpass')
        self.client = APIClient()
        self.wallet = Wallet.objects.create(
            owner=self.user,
            account_number='USER-WALLET-123',
            balance=1000.00,
            currency='USD'
        )
        self.pmf_wallet = Wallet.objects.create(
            account_number='PMF-ETH-PAYPAL',
            balance=0.00,
            currency='USD'
        )

    def test_money_transfer_escrow_signal(self):
        # Create a MoneyTransfer
        transfer = MoneyTransfer.objects.create(
            sender=self.user,
            recipient_name='John Doe',
            recipient_phone_number='+1234567890',
            recipient_bank_account='123456789',
            amount=100.00,
            currency_type='USD'
        )
        # Initiate escrow
        escrow = transfer.initiate_escrow()
        self.assertEqual(transfer.status, 'in_escrow', "Transaction status should be 'in_escrow' after initiating escrow")

        # Update escrow status
        escrow.release_funds()
        transfer.refresh_from_db()
        self.assertEqual(transfer.status, 'completed', "Transaction status should be 'completed' after escrow release")

    def test_foreign_currency_request_escrow_signal(self):
        # Create a ForeignCurrencyRequest
        request = ForeignCurrencyRequest.objects.create(
            requester=self.user,
            amount_requested=200.00,
            currency_type='USD',
            purpose='Test purpose',
            recipient_full_name='Jane Doe',
            recipient_account_number='987654321',
            recipient_sort_code='12-34-56'
        )
        # Initiate escrow
        escrow = request.initiate_escrow()
        self.assertEqual(request.status, 'in_escrow', "Request status should be 'in_escrow' after initiating escrow")

        # Update escrow status
        escrow.refund_funds()
        request.refresh_from_db()
        self.assertEqual(request.status, 'canceled', "Request status should be 'canceled' after escrow refund")

class EscrowViewSetTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpass')
        self.admin = User.objects.create_superuser(username='admin', password='adminpass')
        self.client = APIClient()
        self.wallet = Wallet.objects.create(
            owner=self.user,
            account_number='USER-WALLET-123',
            balance=1000.00,
            currency='USD'
        )
        self.pmf_wallet = Wallet.objects.create(
            account_number='PMF-ETH-PAYPAL',
            balance=0.00,
            currency='USD'
        )

    def test_release_escrow(self):
        # Create a MoneyTransfer and escrow
        transfer = MoneyTransfer.objects.create(
            sender=self.user,
            recipient_name='John Doe',
            recipient_phone_number='+1234567890',
            recipient_bank_account='123456789',
            amount=100.00,
            currency_type='USD'
        )
        escrow = transfer.initiate_escrow()

        # Log in as admin
        self.client.login(username='admin', password='adminpass')

        # Call release endpoint
        response = self.client.post(f'/api/escrow/{escrow.id}/release/')
        self.assertEqual(response.status_code, 200, "Release endpoint should return 200")
        
        # Refresh objects
        transfer.refresh_from_db()
        pmf_wallet = Wallet.objects.get(account_number='PMF-ETH-PAYPAL')
        
        # Check transaction status
        self.assertEqual(transfer.status, 'completed', "Transaction status should be 'completed' after release")
        self.assertEqual(pmf_wallet.balance, 100.00, "PMF wallet balance should increase by escrow amount")
        
        # Check TransactionLog
        log = TransactionLog.objects.filter(description__contains=f"Escrow release for {escrow.content_type} {escrow.object_id}").first()
        self.assertIsNotNone(log, "TransactionLog should be created for release")

    def test_refund_escrow(self):
        # Create a MoneyTransfer and escrow
        transfer = MoneyTransfer.objects.create(
            sender=self.user,
            recipient_name='John Doe',
            recipient_phone_number='+1234567890',
            recipient_bank_account='123456789',
            amount=100.00,
            currency_type='USD'
        )
        escrow = transfer.initiate_escrow()

        # Log in as admin
        self.client.login(username='admin', password='adminpass')

        # Call refund endpoint
        response = self.client.post(f'/api/escrow/{escrow.id}/refund/')
        self.assertEqual(response.status_code, 200, "Refund endpoint should return 200")
        
        # Refresh objects
        transfer.refresh_from_db()
        user_wallet = Wallet.objects.get(account_number='USER-WALLET-123')
        
        # Check transaction status
        self.assertEqual(transfer.status, 'canceled', "Transaction status should be 'canceled' after refund")
        self.assertEqual(user_wallet.balance, 1100.00, "User wallet balance should increase by escrow amount")
        
        # Check TransactionLog
        log = TransactionLog.objects.filter(description__contains=f"Escrow refund for {escrow.content_type} {escrow.object_id}").first()
        self.assertIsNotNone(log, "TransactionLog should be created for refund")

    def test_dispute_escrow(self):
        # Create a MoneyTransfer and escrow
        transfer = MoneyTransfer.objects.create(
            sender=self.user,
            recipient_name='John Doe',
            recipient_phone_number='+1234567890',
            recipient_bank_account='123456789',
            amount=100.00,
            currency_type='USD'
        )
        escrow = transfer.initiate_escrow()

        # Log in as admin
        self.client.login(username='admin', password='adminpass')

        # Call dispute endpoint
        response = self.client.post(f'/api/escrow/{escrow.id}/dispute/')
        self.assertEqual(response.status_code, 200, "Dispute endpoint should return 200")
        
        # Refresh objects
        transfer.refresh_from_db()
        
        # Check transaction status
        self.assertEqual(transfer.status, 'disputed', "Transaction status should be 'disputed' after dispute")
        
        # Check TransactionLog
        log = TransactionLog.objects.filter(description__contains=f"Escrow disputed for {escrow.content_type} {escrow.object_id}").first()
        self.assertIsNotNone(log, "TransactionLog should be created for dispute")