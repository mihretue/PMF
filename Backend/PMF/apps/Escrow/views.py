from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Escrow
from .serializers import EscrowSerializer
from apps.accounts.permissions import IsAdmin
from apps.Notifications.models import Notification

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

        # 🟢 Notification: Funds released
        try:
            # Notify the relevant user (e.g., receiver of escrowed funds)
            user = getattr(escrow.content_object, "receiver", None) or getattr(escrow.content_object, "user", None)
            if user:
                Notification.objects.create(
                    user=user,
                    message=f"Funds from escrow (ID: {escrow.id}) have been released to you."
                )
        except Exception as e:
            pass

        return Response({'message': 'Funds released.'}, status=200)

    @action(detail=True, methods=['post'])
    def refund(self, request, pk=None):
        escrow = self.get_object()
        if escrow.status in ['in_escrow', 'disputed']:
            escrow.refund_funds()

            # 🟢 Notification: Funds refunded
            try:
                user = getattr(escrow.content_object, "sender", None) or getattr(escrow.content_object, "user", None)
                if user:
                    Notification.objects.create(
                        user=user,
                        message=f"Funds in escrow (ID: {escrow.id}) have been refunded to you."
                    )
            except Exception as e:
                pass

            return Response({'message': 'Funds refunded.'}, status=200)
        return Response({'error': 'Cannot refund funds at this stage.'}, status=400)

    @action(detail=True, methods=['post'])
    def dispute(self, request, pk=None):
        escrow = self.get_object()
        if escrow.status == 'in_escrow':
            escrow.mark_as_disputed()
            # 🟢 Notification: Escrow disputed
            try:
                user = getattr(escrow.content_object, "sender", None) or getattr(escrow.content_object, "user", None)
                if user:
                    Notification.objects.create(
                        user=user,
                        message=f"Escrow (ID: {escrow.id}) has been marked as disputed. Please contact support if you need assistance."
                    )
            except Exception as e:
                pass

            return Response({'message': 'Escrow marked as disputed.'}, status=200)
        return Response({'error': 'Cannot dispute this escrow.'}, status=400)