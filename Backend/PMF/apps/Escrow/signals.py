from django.db.models.signals import post_save
from django.dispatch import receiver
from apps.Transaction.models import MoneyTransfer
from django.contrib.contenttypes.models import ContentType
from .models import Escrow
import threading 

_local = threading.local()

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
def update_related_transactions(sender, instance, **kwargs):
    """Update related transaction when escrow status changes."""
    # Avoid running during raw saves (e.g., fixtures) or recursive saves
    if kwargs.get('raw', False) or getattr(_local, 'updating', False):
        return

    try:
        _local.updating = True
        if instance.content_object:
            instance.content_object.update_from_escrow()
    finally:
        _local.updating = False