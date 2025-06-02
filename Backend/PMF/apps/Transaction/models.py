from django.db import models
from django.conf import settings
from decimal import Decimal
from django.utils.timezone import now

class MoneyTransfer(models.Model):
    """
    Model for sending money (Money Transfer)
    """
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name="money_transfers")
    recipient_name = models.CharField(max_length=255)
    recipient_phone_number = models.CharField(max_length=20)
    recipient_bank_account = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    currency_type = models.CharField(max_length=10)
    status = models.CharField(max_length=10, choices=[
        ('pending', 'Pending'), 
        ('completed', 'Completed'), 
        ('failed', 'Failed'), 
        ('canceled', 'Canceled')
    ], default='pending')
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

    # def calculate_exchange_rate(self):
    #     """Fetch the latest exchange rate"""
    #     from .services import get_exchange_rate
    #     return get_exchange_rate(self.currency_type, "ETB")  # Assuming recipient currency is ETB


class ForeignCurrencyRequest(models.Model):
    """
    Model for requesting foreign currency
    """
    requester = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name="foreign_currency_requests")
    amount_requested = models.DecimalField(max_digits=12, decimal_places=2)
    currency_type = models.CharField(max_length=10)
    urgency_level = models.CharField(max_length=50, choices=[('low', 'Low'), ('medium', 'Medium'), ('high', 'High')], default='medium')
    purpose = models.CharField(max_length=255)
    status = models.CharField(max_length=10, choices=[
        ('pending', 'Pending'), 
        ('approved', 'Approved'), 
        ('rejected', 'Rejected')
    ], default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Foreign Currency Request {self.id} by {self.requester}"


class ExchangeRate(models.Model):
    """
    Model to store exchange rates for different currencies.
    """
    currency_from = models.CharField(max_length=10)  # Example: "USD"
    currency_to = models.CharField(max_length=10)  # Example: "ETB"
    rate = models.DecimalField(max_digits=12, decimal_places=6)  # Example: 56.23
    last_updated = models.DateTimeField(default=now)

    def __str__(self):
        return f"1 {self.currency_from} = {self.rate} {self.currency_to}"
    
    
    # WALLET MODEL
class Wallet(models.Model):
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True)
    account_number = models.CharField(max_length=100, unique=True)
    balance = models.DecimalField(max_digits=12, decimal_places=2)
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
