from celery import shared_task
from django.contrib.contenttypes.models import ContentType
from apps.Transaction.models import MoneyTransfer
from .models import Escrow

@shared_task(bind=True, autoretry_for=(Exception,), retry_kwargs={'max_retries': 5, 'countdown': 5})
def create_escrow_for_transfer_task(self, transfer_id):
    transfer = MoneyTransfer.objects.get(id=transfer_id)
    if transfer.status == 'pending':
        Escrow.objects.create(
            content_type=ContentType.objects.get_for_model(transfer),
            object_id=transfer.id,
            amount=transfer.amount,
            status='in_escrow'
        )

@shared_task(bind=True, autoretry_for=(Exception,), retry_kwargs={'max_retries': 5, 'countdown': 5})
def update_related_transactions_task(self, escrow_id):
    escrow = Escrow.objects.get(id=escrow_id)
    if escrow.content_object:
        escrow.content_object.update_from_escrow()
