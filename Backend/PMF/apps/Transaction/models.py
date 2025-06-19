from django.db import models
from django.conf import settings
from decimal import Decimal
from django.utils.timezone import now
from apps.Escrow.models import Escrow
from django.core.validators import RegexValidator
from .services import get_live_exchange_rate
from django.db.models import JSONField
from django.db import transaction
from django.contrib.contenttypes.models import ContentType
from django.utils.timezone import now, timedelta
from cloudinary.models import CloudinaryField


CURRENCY_CHOICES = [
    ('USD', 'US Dollar'),
    ('EUR', 'Euro'),
    ('ETB', 'Ethiopian Birr'),
    ('GBP', 'British Pound'),
]

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
    proof_document = CloudinaryField('proof_document', blank=True, null=True)
    
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
    currency_type = models.CharField(max_length=10,choices=CURRENCY_CHOICES)

    transaction_fee = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True,default=0.00)
    bank_fee = models.DecimalField(max_digits=12, decimal_places=2,null=True,blank=True)
    pmf_fee = models.DecimalField(max_digits=12, decimal_places=2,null=True,blank=True)
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

    def calculate_bank_fee(self):
        return (self.amount * Decimal('0.005')).quantize(Decimal('0.01'))  # 0.5%

    def calculate_pmf_fee(self):
        return (self.amount * Decimal('0.015')).quantize(Decimal('0.01'))  # 1.5%

    def total_fee(self):
        return (self.bank_fee or Decimal('0.00')) + (self.pmf_fee or Decimal('0.00'))

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
        if not self.bank_fee:
            self.bank_fee = self.calculate_bank_fee()
        if not self.pmf_fee:
            self.pmf_fee = self.calculate_pmf_fee()
        if not self.transaction_fee:
            self.transaction_fee = self.total_fee()
        super().save(*args, **kwargs)

class ForeignCurrencyRequest(BaseTransaction):
    requester = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name="foreign_currency_requests")
    amount_requested = models.DecimalField(max_digits=12, decimal_places=2)
    currency_type = models.CharField(max_length=10, choices=CURRENCY_CHOICES)
    PAYMENT_CHOICES = [
        ('telebirr', 'TeleBirr'),
        ('CBE', 'CBE'),
        ('chapa', 'Chapa'),
    ]
    payment_method = models.CharField(max_length=50,choices=PAYMENT_CHOICES, null=True, blank=True)
    purpose = models.CharField(max_length=255)
    urgency_level = models.CharField(max_length=50, choices=[('low', 'Low'), ('medium', 'Medium'), ('high', 'High')], default='medium')
    bank_fee = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    pmf_fee = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)

    # New fields for recipient
    recipient_full_name = models.CharField(max_length=255)
    recipient_account_number = models.CharField(max_length=50, null=True, blank=True)
    recipient_sort_code = models.CharField(max_length=20, null=True, blank=True)
    exchange_rate = models.DecimalField(max_digits=12,decimal_places=6, null=True, blank=True)
    transaction_fee = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True,default=0.00)
    bank_name = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Foreign Currency Request {self.id} by {self.requester}"

    def calculate_bank_fee(self):
        if self.exchange_rate is None or self.amount_requested is None:
            return Decimal('0.00')
        fee = (self.amount_requested * self.exchange_rate * Decimal('0.005')).quantize(Decimal('0.01'))
        self.bank_fee = fee
        return fee

    def calculate_pmf_fee(self):
        if self.exchange_rate is None or self.amount_requested is None:
            return Decimal('0.00')
        fee = (self.amount_requested * self.exchange_rate * Decimal('0.015')).quantize(Decimal('0.01'))
        self.pmf_fee = fee
        return fee

    def total_fee(self):
        return (self.bank_fee or Decimal('0.00')) + (self.pmf_fee or Decimal('0.00'))

    
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
        if not self.bank_fee:
            self.bank_fee = self.calculate_bank_fee()
        if not self.pmf_fee:
            self.pmf_fee = self.calculate_pmf_fee()
        if not self.transaction_fee:
            self.transaction_fee = self.total_fee()
        
        if not self.exchange_rate:
            rate = get_live_exchange_rate("ETB", self.currency_type)
            if rate:
                self.exchange_rate = rate
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


class DailyExchangeRate(models.Model):
    date = models.DateField(unique=True)
    base_code = models.CharField(max_length=10)
    rates = JSONField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Rates on {self.date}"
    


class CurrencyAlert(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    target_rate = models.DecimalField(
        max_digits=12,
        decimal_places=4,
        null=True,
        blank=True,
        help_text="Central rate used to calculate min/max thresholds"
    )
    base_currency = models.CharField(max_length=10)
    target_currency = models.CharField(max_length=10)
    min_rate = models.DecimalField(max_digits=12, decimal_places=4)
    max_rate = models.DecimalField(max_digits=12, decimal_places=4)
    is_active = models.BooleanField(default=True)
    notify_interval = models.DurationField(default=timedelta(hours=1))  # New field  
    created_at = models.DateTimeField(auto_now_add=True)
    notified_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.email} Alert for {self.base_currency}/{self.target_currency} between {self.min_rate}-{self.max_rate}"
    
    @property
    def threshold_percent(self):
        if self.target_rate and self.min_rate:
            return ((self.target_rate - self.min_rate) / self.target_rate) * 100
        return None