from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Escrow
from .serializers import EscrowSerializer
from apps.accounts.permissions import IsAdmin
class EscrowViewSet(viewsets.ModelViewSet):
    queryset = Escrow.objects.all()
    serializer_class = EscrowSerializer
    permission_classes= [IsAdmin]
    
  
    @action(detail=True, methods=['post'])
    def release(self, request, pk=None):
        escrow = self.get_object()
        if escrow.status != 'in_escrow':
            return Response({'error': 'Cannot release funds at this stage.'}, status=400)

        pmf_eth_wallet = Wallet.objects.get(account_number="PMF-ETH-PAYPAL")
        pmf_eth_wallet.balance += escrow.amount
        pmf_eth_wallet.save()

        TransactionLog.objects.create(
            source_account="Escrow",
            destination_account=pmf_eth_wallet.account_number,
            amount=escrow.amount,
            description=f"Escrow release for {escrow.content_type} {escrow.object_id}"
        )

        escrow.release_funds()

        return Response({'message': 'Funds released.'}, status=200)
    @action(detail=True, methods=['post'])
    def refund(self, request, pk=None):
        escrow = self.get_object()
        if escrow.status in ['in_escrow', 'disputed']:
            escrow.refund_funds()
            return Response({'message': 'Funds refunded.'}, status=200)
        return Response({'error': 'Cannot refund funds at this stage.'}, status=400)

    @action(detail=True, methods=['post'])
    def dispute(self, request, pk=None):
        escrow = self.get_object()
        if escrow.status == 'in_escrow':
            escrow.mark_as_disputed()
            return Response({'message': 'Escrow marked as disputed.'}, status=200)
        return Response({'error': 'Cannot dispute this escrow.'}, status=400)
