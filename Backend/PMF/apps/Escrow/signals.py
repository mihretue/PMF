from django.db.models.signals import post_save
from django.dispatch import receiver
from apps.Transaction.models import MoneyTransfer
from .models import Escrow
from .tasks import create_escrow_for_transfer_task, update_related_transactions_task

@receiver(post_save, sender=MoneyTransfer)
def handle_money_transfer_save(sender, instance, created, **kwargs):
    if created:
        create_escrow_for_transfer_task.delay(instance.id)

@receiver(post_save, sender=Escrow)
def handle_escrow_save(sender, instance, **kwargs):
    update_related_transactions_task.delay(instance.id)
