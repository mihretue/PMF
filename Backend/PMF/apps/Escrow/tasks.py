# from celery import shared_task   <-- remove this import

from django.contrib.contenttypes.models import ContentType
from apps.Transaction.models import MoneyTransfer
from .models import Escrow

def create_escrow_for_transfer(transfer_id):
    transfer = MoneyTransfer.objects.get(id=transfer_id)
    if transfer.status == 'pending':
        Escrow.objects.create(
            content_type=ContentType.objects.get_for_model(transfer),
            object_id=transfer.id,
            amount=transfer.amount,
            status='in_escrow'
        )

def update_related_transactions(escrow_id):
    escrow = Escrow.objects.get(id=escrow_id)
    if escrow.content_object:
        escrow.content_object.update_from_escrow()
