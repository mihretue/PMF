from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Escrow
from .serializers import EscrowSerializer

class EscrowViewSet(viewsets.ModelViewSet):
    queryset = Escrow.objects.all()
    serializer_class = EscrowSerializer

    @action(detail=True, methods=['post'])
    def release(self, request, pk=None):
        escrow = self.get_object()
        if escrow.status == 'in_escrow':
            escrow.release_funds()
            return Response({'message': 'Funds released.'}, status=200)
        return Response({'error': 'Cannot release funds at this stage.'}, status=400)

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
