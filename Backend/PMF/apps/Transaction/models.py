from django.db import models
from django.conf import settings
from decimal import Decimal
from django.utils.timezone import now
from apps.Escrow.models import Escrow
from django.core.validators import RegexValidator

class BaseTransaction(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('canceled', 'Canceled'),
        ('in_escrow', 'In Escrow'),
        ('released', 'Released'),
        ('disputed', 'Disputed')
    ]
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    escrow = models.OneToOneField('Escrow.Escrow', null=True, blank=True, on_delete=models.SET_NULL)
    
    class Meta:
        abstract = True

    def update_from_escrow(self):
        if self.escrow:
            with transaction.atomic():
                self.status = self.get_mapped_status(self.escrow.status)
                self.save()

    @staticmethod
    def get_mapped_status(escrow_status):
        mapping = {
            'pending': 'pending',
            'funds_held': 'in_escrow',
            'released': 'completed',
            'refunded': 'canceled',
            'disputed': 'disputed'
        }
        return mapping.get(escrow_status, 'pending')
    
class MoneyTransfer(BaseTransaction):
    """
    Model for sending money (Money Transfer)
    """
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name="money_transfers")
    recipient_name = models.CharField(max_length=255)
    recipient_phone_number = models.CharField(max_length=20)
    recipient_bank_account = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    currency_type = models.CharField(max_length=10)

    transaction_fee = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    
    PAYMENT_CHOICES = [
        ('paypal', 'PayPal'),
        ('bank_transfer', 'Bank Transfer'),
        ('mobile_money', 'Mobile Money'),
    ]
    payment_method = models.CharField(max_length=20, choices=PAYMENT_CHOICES, default='paypal')
    purpose = models.CharField(max_length=255, blank=True)
    bank_name = models.CharField(max_length=255, blank=True)
    exchange_rate = models.DecimalField(max_digits=12, decimal_places=6, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Money Transfer {self.id} - {self.sender} to {self.recipient_name}"

    def calculate_transaction_fee(self):
        """Example transaction fee: 2% of the transaction amount."""
        return self.amount * Decimal(0.02)

    def initiate_escrow(self):
        with transaction.atomic():
            if not self.escrow:
                self.escrow = Escrow.objects.create(
                    amount=self.amount,
                    currency=self.currency_type,
                    status='funds_held',
                    content_type=ContentType.objects.get_for_model(self),
                    object_id=self.pk
                )
                self.save()
            return self.escrow
    def save(self, *args, **kwargs):
        if not self.transaction_fee:
            self.transaction_fee = self.calculate_transaction_fee()
        super().save(*args, **kwargs)

class ForeignCurrencyRequest(BaseTransaction):
    requester = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name="foreign_currency_requests")
    amount_requested = models.DecimalField(max_digits=12, decimal_places=2)
    currency_type = models.CharField(max_length=10)
    payment_method = models.CharField(max_length=50, null=True, blank=True)
    purpose = models.CharField(max_length=255)
    urgency_level = models.CharField(max_length=50, choices=[('low', 'Low'), ('medium', 'Medium'), ('high', 'High')], default='medium')
    
    # New fields for recipient
    recipient_full_name = models.CharField(max_length=255)
    recipient_account_number = models.CharField(max_length=50, null=True, blank=True)
    recipient_sort_code = models.CharField(max_length=20, null=True, blank=True)
    
    transaction_fee = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Foreign Currency Request {self.id} by {self.requester}"

    def calculate_transaction_fee(self):
        """Example flat 2% fee"""
        return self.amount_requested * Decimal(0.02)
    
    def initiate_escrow(self):
        with transaction.atomic():
            if not self.escrow:
                self.escrow = Escrow.objects.create(
                    amount=self.amount_requested,
                    currency=self.currency_type,
                    status='funds_held',
                    content_type=ContentType.objects.get_for_model(self),
                    object_id=self.pk
                )
                self.save()
            return self.escrow
        
    def save(self, *args, **kwargs):
        if not self.transaction_fee:
            self.transaction_fee = self.calculate_transaction_fee()
        super().save(*args, **kwargs)
        
class ExchangeRate(models.Model):
    """
    Model to store exchange rates for different currencies.
    """
    currency_regex = RegexValidator(regex=r'^[A-Z]{3}$', message="Currency code must be a 3-letter ISO 4217 code (e.g., USD).")
    currency_from = models.CharField(max_length=10, validators=[currency_regex])  # Example: "USD"
    currency_to = models.CharField(max_length=10, validators=[currency_regex])  # Example: "ETB"
    rate = models.DecimalField(max_digits=12, decimal_places=6)  # Example: 56.23
    last_updated = models.DateTimeField(default=now)

    def __str__(self):
        return f"1 {self.currency_from} = {self.rate} {self.currency_to}"
    
    
    # WALLET MODEL
class Wallet(models.Model):
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True)
    account_number = models.CharField(max_length=100, unique=True)
    balance = models.DecimalField(max_digits=12, decimal_places=2,default=0.00)
    currency = models.CharField(max_length=10, default="USD")

    def __str__(self):
        return f"{self.account_number} | {self.balance} {self.currency}"


# TRANSACTION LOG
class TransactionLog(models.Model):
    source_account = models.CharField(max_length=100)
    destination_account = models.CharField(max_length=100)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    description = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.amount} from {self.source_account} to {self.destination_account} @ {self.timestamp}"
