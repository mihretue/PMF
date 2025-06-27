from django.test import TestCase
from django.contrib.auth import get_user_model
from apps.Escrow.models import Escrow
from .models import MoneyTransfer

User = get_user_model()

class TransactionProofUploadTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpass')

        self.money_transfer = MoneyTransfer.objects.create(
            sender=self.user,
            recipient_name="Recipient One",
            recipient_phone_number="123456789",
            recipient_bank_account="ACC123456",
            amount=1000,
            currency_type="USD",
        )
        self.escrow = self.money_transfer.initiate_escrow()

    def test_proof_upload_updates_escrow_status(self):
        # Initially: Escrow status should be 'funds_held' from initiate_escrow
        self.assertEqual(self.escrow.status, 'funds_held')
        self.assertEqual(self.money_transfer.status, 'in_escrow')

        # Reset escrow status manually to pending for test simulation
        self.escrow.status = 'pending'
        self.escrow.save()

        # Confirm reset
        self.money_transfer.refresh_from_db()
        self.assertEqual(self.money_transfer.status, 'pending')

        # Upload proof document (simulate image upload via dummy URL or string for CloudinaryField)
        self.money_transfer.proof_document = "https://dummyurl.com/proof.png"
        self.money_transfer.save()

        # Reload related models
        self.money_transfer.refresh_from_db()
        self.escrow.refresh_from_db()

        # Now the escrow should be funds_held
        self.assertEqual(self.escrow.status, 'funds_held')
        self.assertEqual(self.money_transfer.status, 'in_escrow')

    def test_no_proof_no_escrow_status_change(self):
        self.escrow.status = 'pending'
        self.escrow.save()

        # Saving transaction without proof should not affect escrow
        self.money_transfer.save()
        self.escrow.refresh_from_db()

        self.assertEqual(self.escrow.status, 'pending')
