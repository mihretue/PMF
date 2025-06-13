from django.db.models.signals import post_save
from django.dispatch import receiver
from apps.Transaction.models import MoneyTransfer
from django.contrib.contenttypes.models import ContentType
from .models import Escrow
from apps.Notifications.models import Notification

@receiver(post_save, sender=MoneyTransfer)
def create_escrow_for_transfer(sender, instance, created, **kwargs):
    if created and instance.status == 'pending':
        escrow = Escrow.objects.create(
            content_type=ContentType.objects.get_for_model(instance),
            object_id=instance.id,
            amount=instance.amount,
            status='in_escrow'
        )
        # 🟢 Notify the sender (or receiver, depending on your logic)
        try:
            Notification.objects.create(
                user=instance.sender,  # or instance.receiver if you want to notify the receiver
                message=f"An escrow has been created for your transaction (ID: {instance.id}) and funds are held in escrow."
            )
        except Exception as e:
            pass  # Don't block main flow for notification errors