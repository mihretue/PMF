from django.db.models.signals import post_save
from django.dispatch import receiver
from apps.Transaction.models import MoneyTransfer
from .models import Escrow
from .tasks import create_escrow_for_transfer, update_related_transactions  # your refactored plain functions
from apps.Notifications.models import Notification

@receiver(post_save, sender=MoneyTransfer)
def create_escrow_for_transfer(sender, instance, created, **kwargs):
    if created and instance.status == 'pending':
        Escrow.objects.create(
            content_type=ContentType.objects.get_for_model(instance),
            object_id=instance.id,
            amount=instance.amount,
            status='in_escrow'
        )
