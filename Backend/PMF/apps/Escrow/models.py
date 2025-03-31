from django.db import models
from django.conf import settings
from apps.Transaction.models import ForeignCurrencyRequest


class Escrow(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('in_escrow', 'In Escrow'),
        ('released', 'Released'),
        ('refunded', 'Refunded'),
        ('disputed', 'Disputed'),
    ]

    transaction = models.OneToOneField('Transaction.ForeignCurrencyRequest', on_delete=models.CASCADE, related_name="escrow")

    amount = models.DecimalField(max_digits=12, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def release_funds(self):
        """Release funds to the recipient."""
        if self.status == 'in_escrow':
            self.status = 'released'
            self.save()

    def refund_funds(self):
        """Refund funds back to the sender."""
        if self.status in ['in_escrow', 'disputed']:
            self.status = 'refunded'
            self.save()

    def mark_as_disputed(self):
        """Mark transaction as disputed."""
        if self.status == 'in_escrow':
            self.status = 'disputed'
            self.save()

    def __str__(self):
        return f"Escrow for Transaction {self.transaction.id} - {self.status}"
