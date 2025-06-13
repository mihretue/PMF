from rest_framework import viewsets, permissions, status, serializers
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from .models import MoneyTransfer, ForeignCurrencyRequest, ExchangeRate, TransactionLog, Wallet
from .serializers import MoneyTransferSerializer, ForeignCurrencyRequestSerializer, ExchangeRateSerializer, WalletSerializer, TransactionLogSerializer
from apps.accounts.permissions import IsSender, IsAdmin, IsAdminOrReceiver, IsAdminOrSender, IsSenderOrReceiver, IsReceiver
from .services import get_live_exchange_rate
from decimal import Decimal
from django.db import transaction
from django.contrib.contenttypes.models import ContentType
from apps.Escrow.models import Escrow
from .signals import create_wallet_for_new_user
from apps.Notifications.models import Notification  # 🟢 Import Notification

class MoneyTransferViewSet(viewsets.ModelViewSet):
    """
    API for handling Money Transfers.
    - Only Senders can create a Money Transfer.
    - Admins can view and manage all transactions.
    """
    queryset = MoneyTransfer.objects.all()
    serializer_class = MoneyTransferSerializer
    permission_classes = [IsSender]

    def perform_create(self, serializer):
        request = self.request
        currency_to = request.data.get('currency_to', 'ETB')
        account_number= request.data.get('account_number', 'SENDER-PAYPAL-TEST')
        with transaction.atomic():
            transfer = serializer.save(sender=request.user)
            transfer.transaction_fee = transfer.calculate_transaction_fee()
            sender_wallet, created = Wallet.objects.get_or_create(
                account_number="SENDER-PAYPAL-TEST",
                defaults={"balance": 10000, "currency": "USD"}
            )
            total_deduct = transfer.amount + transfer.transaction_fee
            if sender_wallet.balance < total_deduct:
                raise serializers.ValidationError(
                    {"error": "Insufficient funds."},
                    code="insufficient_funds"
                )
            sender_wallet.balance -= total_deduct
            sender_wallet.save()
            pmf_eth_wallet = Wallet.objects.get(account_number=account_number)
            pmf_eth_wallet.balance += transfer.amount
            pmf_eth_wallet.save()
            TransactionLog.objects.create(
                source_account=sender_wallet.account_number,
                destination_account=pmf_eth_wallet.account_number,
                amount=transfer.amount,
                description=f"MoneyTransfer #{transfer.id}"
            )
            Escrow.objects.create(
                content_type=ContentType.objects.get_for_model(transfer),
                object_id=transfer.id,
                amount=transfer.amount,
                status='in_escrow'
            )
            transfer.status = 'in_escrow'
            transfer.save()

            # 🟢 Notification: Money Transfer Created
            try:
                Notification.objects.create(
                    user=request.user,
                    message=f"Your money transfer (ID: {transfer.id}) has been initiated and funds are now held in escrow."
                )
            except Exception:
                pass

    def get_queryset(self):
        user = self.request.user
        if user.is_admin():
            return MoneyTransfer.objects.all()
        return MoneyTransfer.objects.filter(sender=user)

    @action(detail=True, methods=['POST'])
    def cancel(self, request, pk=None):
        """
        Allow users to cancel their own **pending** money transfers.
        """
        money_transfer = self.get_object()
        if money_transfer.sender != request.user:
            return Response({"error": "You can only cancel your own transactions."}, status=status.HTTP_403_FORBIDDEN)
        if money_transfer.status != 'pending':
            return Response({"error": "Only pending transactions can be canceled."}, status=status.HTTP_400_BAD_REQUEST)
        money_transfer.status = 'canceled'
        money_transfer.save()
        # 🟢 Notification: Money Transfer Canceled
        try:
            Notification.objects.create(
                user=money_transfer.sender,
                message=f"Your money transfer (ID: {money_transfer.id}) has been canceled."
            )
        except Exception:
            pass
        return Response({"message": "Transaction canceled successfully."}, status=status.HTTP_200_OK)


class ForeignCurrencyRequestViewSet(viewsets.ModelViewSet):
    queryset = ForeignCurrencyRequest.objects.all()
    serializer_class = ForeignCurrencyRequestSerializer
    permission_classes = [IsReceiver]

    def perform_create(self, serializer):
        request = self.request
        with transaction.atomic():
            foreign_request = serializer.save(requester=request.user)
            foreign_request.transaction_fee = foreign_request.calculate_transaction_fee()
            foreign_request.save()
            pmf_euro_wallet = Wallet.objects.get(account_number="PMF-EURO-PAYPAL")
            total_deduct = foreign_request.amount_requested + foreign_request.transaction_fee
            if pmf_euro_wallet.balance < total_deduct:
                raise PermissionDenied("Insufficient funds in PMF EURO account.")
            pmf_euro_wallet.balance -= total_deduct
            pmf_euro_wallet.save()
            TransactionLog.objects.create(
                source_account=pmf_euro_wallet.account_number,
                destination_account="Escrow",
                amount=foreign_request.amount_requested,
                description=f"Foreign Currency Request #{foreign_request.id} escrowed"
            )
            Escrow.objects.create(
                content_type=ContentType.objects.get_for_model(foreign_request),
                object_id=foreign_request.id,
                amount=foreign_request.amount_requested
            )
            foreign_request.status = 'approved'
            foreign_request.save()

            # 🟢 Notification: Foreign Currency Request Created
            try:
                Notification.objects.create(
                    user=request.user,
                    message=f"Your foreign currency request (ID: {foreign_request.id}) has been submitted and escrowed."
                )
            except Exception:
                pass

    def get_queryset(self):
        user = self.request.user
        if user.is_admin():
            return ForeignCurrencyRequest.objects.all()
        return ForeignCurrencyRequest.objects.filter(requester=user)


class ExchangeRateViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ExchangeRate.objects.all()
    serializer_class = ExchangeRateSerializer
    permission_classes = [permissions.AllowAny]

    def list(self, request):
        usd_to_etb = get_live_exchange_rate("USD", "ETB")
        eur_to_etb = get_live_exchange_rate("EUR", "ETB")
        if not usd_to_etb or not eur_to_etb:
            return Response(
                {"error": "Exchange rates unavailable"}, 
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )
        data = {
            "USD": usd_to_etb,
            "EUR": eur_to_etb,
        }
        return Response(data)      

class TransactionFeeViewSet(viewsets.ViewSet):
    """
    API for calculating transaction fees.
    """
    permission_classes = [permissions.AllowAny]

    @action(detail=False, methods=['GET'], url_path='calculate-fee')
    def calculate_transaction_fee(self, request):
        amount = Decimal(request.GET.get('amount', 0))
        fee = amount * Decimal('0.02')
        return Response({'transaction_fee': str(fee)})

class MyTransactionViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['get'], url_path='money-transfers',permission_classes=[IsSender])
    def money_transfers(self, request): 
        transfers = MoneyTransfer.objects.filter(sender=request.user).order_by('-created_at')
        serializer = MoneyTransferSerializer(transfers, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='foreign-requests', permission_classes=[IsReceiver])
    def foreign_requests(self, request):
        requests = ForeignCurrencyRequest.objects.filter(requester=request.user).order_by('-created_at')
        serializer = ForeignCurrencyRequestSerializer(requests, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='all')
    def all_transactions(self, request):
        transfers = MoneyTransfer.objects.filter(sender=request.user)
        requests = ForeignCurrencyRequest.objects.filter(requester=request.user)
        transfer_serializer = MoneyTransferSerializer(transfers, many=True)
        request_serializer = ForeignCurrencyRequestSerializer(requests, many=True)
        return Response({
            "money_transfers": transfer_serializer.data,
            "foreign_currency_requests": request_serializer.data
        })