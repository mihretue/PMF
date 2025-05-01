from django.db.models.signals import post_save
from django.dispatch import receiver
from apps.Transaction.models import Transaction
from .models import Escrow

@receiver(post_save, sender=Transaction)
def create_escrow_on_transaction(sender, instance, created, **kwargs):
    if created and instance.status == 'pending':
        Escrow.objects.create(transaction=instance, amount=instance.amount, status='in_escrow')
