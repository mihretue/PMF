from django.db import models
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType

class Escrow(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('in_escrow', 'In Escrow'),
        ('released', 'Released'),
        ('refunded', 'Refunded'),
        ('disputed', 'Disputed'),
    ]

    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    transaction = GenericForeignKey('content_type', 'object_id')  # Can link to MoneyTransfer or ForeignCurrencyRequest

    amount = models.DecimalField(max_digits=12, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def release_funds(self):
        if self.status == 'in_escrow':
            self.status = 'released'
            self.save()

    def refund_funds(self):
        if self.status in ['in_escrow', 'disputed']:
            self.status = 'refunded'
            self.save()

    def mark_as_disputed(self):
        if self.status == 'in_escrow':
            self.status = 'disputed'
            self.save()

    def __str__(self):
        return f"Escrow for {self.content_type} {self.object_id} - {self.status}"
