from django.db import models
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.core.exceptions import ValidationError
from django.db import transaction

class Escrow(models.Model):
    STATUS_CHOICES = [
        ('pending', 'pending'),
        ('funds_held', 'Funds Held'),
        ('released', 'Released'),
        ('refunded', 'Refunded'),
        ('disputed', 'Disputed')
    ]
    

    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE, null=True, blank=True)
    object_id = models.PositiveIntegerField(null=True, blank=True)
    # In Escrow model
    currency = models.CharField(max_length=10, default='USD')
    # transaction = GenericForeignKey('content_type', 'object_id')  # Can link to MoneyTransfer or ForeignCurrencyRequest
    content_object = GenericForeignKey('content_type', 'object_id') 
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.CheckConstraint(check=models.Q(amount__gt=0), name='positive_amount')
        ]
    def clean(self):
        if self.amount <= 0:
            raise ValidationError("Amount must be positive.")   
    
    def release_funds(self):
        with transaction.atomic():
            if self.status == 'funds_held':
                self.status = 'released'
                self.save()
            else:
                raise ValueError(f"Cannot release funds from status: {self.status}")
            
    def refund_funds(self):
        with transaction.atomic():
            if self.status in ['funds_held', 'disputed']:
                self.status = 'refunded'
                self.save()
            else:
                raise ValueError(f"Cannot refund funds from status: {self.status}")

    def mark_as_disputed(self):
        with transaction.atomic():
            if self.status == 'funds_held':
                self.status = 'disputed'
                self.save()
            else:
                raise ValueError(f"Cannot mark as disputed from status: {self.status}")

    def __str__(self):
        content = f"{self.content_type} {self.object_id}" if self.content_type and self.object_id else "Unlinked"
        return f"Escrow for {content} - {self.status}"

    def save(self, *args, **kwargs):
        with transaction.atomic():
            super().save(*args, **kwargs)