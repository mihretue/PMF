from django.db.models.signals import post_save
from django.dispatch import receiver
from apps.Transaction.models import MoneyTransfer, ForeignCurrencyRequest
from .models import Escrow
from .tasks import create_escrow_for_transfer, update_related_transactions  # your refactored plain functions
from apps.Notifications.models import Notification
from django.contrib.contenttypes.models import ContentType


@receiver(post_save, sender=MoneyTransfer)
def create_escrow_for_transfer(sender, instance, created, **kwargs):
    if created and instance.status == 'pending':
        Escrow.objects.create(
            content_type=ContentType.objects.get_for_model(instance),
            object_id=instance.id,
            amount=instance.amount,
            status='in_escrow'
        )


@receiver(post_save, sender=Escrow)
def update_transaction_status_from_escrow(sender, instance: Escrow, created, **kwargs):
    if created:
        # New escrow, no status update needed yet
        return
    
    # Find the related transaction using ContentType and object_id stored on escrow
    if instance.content_type and instance.object_id:
        model_class = instance.content_type.model_class()
        try:
            transaction_obj = model_class.objects.get(pk=instance.object_id)
        except model_class.DoesNotExist:
            transaction_obj = None
        
        if transaction_obj:
            # Update the transaction status based on escrow status
            transaction_obj.update_from_escrow()