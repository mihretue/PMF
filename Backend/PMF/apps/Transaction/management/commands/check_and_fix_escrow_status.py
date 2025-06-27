from django.core.management.base import BaseCommand
from apps.Transaction.models import MoneyTransfer, ForeignCurrencyRequest
class Command(BaseCommand):
    help = 'Check and optionally fix misaligned escrow statuses based on uploaded proof documents'

    def handle(self, *args, **options):
        # Check for MoneyTransfer
        transfers = MoneyTransfer.objects.filter(proof_document__isnull=False, escrow__isnull=False).exclude(escrow__status='funds_held')
        for t in transfers:
            print(f"MoneyTransfer {t.id} has proof but escrow status is {t.escrow.status}")
            t.escrow.status = 'funds_held'
            t.escrow.save()
            print(f"Updated escrow {t.escrow.id} status to 'funds_held'.")

        # Check for ForeignCurrencyRequest
        requests = ForeignCurrencyRequest.objects.filter(proof_document__isnull=False, escrow__isnull=False).exclude(escrow__status='funds_held')
        for r in requests:
            print(f"ForeignCurrencyRequest {r.id} has proof but escrow status is {r.escrow.status}")
            r.escrow.status = 'funds_held'
            r.escrow.save()
            print(f"Updated escrow {r.escrow.id} status to 'funds_held'.")

        print("Check complete.")
