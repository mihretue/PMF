from apps.Transaction.models import TransactionLog, MoneyTransfer, ForeignCurrencyRequest
from apps.Transaction.serializers import TransactionLogSerializer, MoneyTransferSerializer, ForeignCurrencyRequestSerializer
from apps.Escrow.serializers import EscrowSerializer

class EscrowTransactionService:
    @staticmethod
    def get_transaction_data(escrow):
        model_class = escrow.content_type.model_class()
        transaction_instance = model_class.objects.filter(id=escrow.object_id).first()

        if not transaction_instance:
            return None

        # Serialize transaction based on its model type
        if isinstance(transaction_instance, MoneyTransfer):
            transaction_data = MoneyTransferSerializer(transaction_instance).data
        elif isinstance(transaction_instance, ForeignCurrencyRequest):
            transaction_data = ForeignCurrencyRequestSerializer(transaction_instance).data
        else:
            transaction_data = {}

        proof_url = transaction_instance.proof_document.url if getattr(transaction_instance, 'proof_document', None) else None

        return {
            'transaction_instance': transaction_instance,
            'transaction_data': transaction_data,
            'proof_document': proof_url
        }

    @staticmethod
    def get_transaction_logs(escrow):
        logs = TransactionLog.objects.filter(
            description__icontains=f"{escrow.content_type.model} #{escrow.object_id}"
        )
        return TransactionLogSerializer(logs, many=True).data

    @staticmethod
    def get_full_escrow_detail(escrow):
        transaction_info = EscrowTransactionService.get_transaction_data(escrow)

        if not transaction_info:
            return None

        logs_data = EscrowTransactionService.get_transaction_logs(escrow)

        return {
            'escrow': EscrowSerializer(escrow).data,
            'transaction': transaction_info['transaction_data'],
            'proof_document': transaction_info['proof_document'],
            'logs': logs_data
        }
