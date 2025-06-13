from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Escrow
from .serializers import EscrowSerializer
from apps.accounts.permissions import IsAdmin
from django.db import transaction

class EscrowViewSet(viewsets.ModelViewSet):
    queryset = Escrow.objects.all()
    serializer_class = EscrowSerializer
    permission_classes= [IsAdmin]
    
  
    @action(detail=True, methods=['post'])
    def release(self, request, pk=None):
        escrow = self.get_object()
        if escrow.status != 'funds_held':
            return Response({'error': 'Cannot release funds at this stage.'}, status=400)

        with transaction.atomic():
            escrow.release_funds()
       
            try:
                pmf_eth_wallet = Wallet.objects.get(account_number="PMF-ETH-PAYPAL")
            except Wallet.DoesNotExist:
                return Response({'error': 'PMF wallet not found.'}, status=400)
            
            pmf_eth_wallet = Wallet.objects.get(account_number="PMF-ETH-PAYPAL")
            pmf_eth_wallet.balance += escrow.amount
            pmf_eth_wallet.save()

            TransactionLog.objects.create(
                source_account="Escrow",
                destination_account=pmf_eth_wallet.account_number,
                amount=escrow.amount,
                description=f"Escrow release for {escrow.content_type} {escrow.object_id}"
            )

     

        
        return Response({'message': 'Funds released and transactions updated.'}, status=200)
    @action(detail=True, methods=['post'])
    def refund(self, request, pk=None):
        escrow = self.get_object()
        if escrow.status not in ['funds_held', 'disputed']:
            return Response({'error': 'Cannot refund funds at this stage.'}, status=400)
        with transaction.atomic():    
            escrow.refund_funds()
            return Response({'message': 'Funds refunded.'}, status=200)

    @action(detail=True, methods=['post'])
    def dispute(self, request, pk=None):
        escrow = self.get_object()
        if escrow.status != 'funds_held':
            return Response({'error': 'Cannot dispute this escrow.'}, status=400)
        with transaction.atomic():
            escrow.mark_as_disputed()
            TransactionLog.objects.create(
                    source_account="Escrow",
                    destination_account="N/A",
                    amount=escrow.amount,
                    description=f"Escrow disputed for {escrow.content_type} {escrow.object_id}"
                )

        return Response({'message': 'Escrow marked as disputed.'}, status=200)