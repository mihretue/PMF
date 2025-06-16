from rest_framework import viewsets, permissions, status, serializers
from rest_framework.response import Response
from rest_framework.decorators import action, api_view, APIView
from rest_framework.exceptions import PermissionDenied
from .models import MoneyTransfer, ForeignCurrencyRequest, ExchangeRate, TransactionLog, Wallet, DailyExchangeRate,CurrencyAlert
from .serializers import MoneyTransferSerializer, ForeignCurrencyRequestSerializer, ExchangeRateSerializer, WalletSerializer,TransactionLogSerializer, DailyExchangeRateSerializer,CurrencyAlertSerializer
from apps.accounts.permissions import IsSender, IsAdmin, IsAdminOrReceiver, IsAdminOrSender, IsSenderOrReceiver, IsReceiver
from .services import get_live_exchange_rate
from decimal import Decimal
from django.db import transaction
from django.contrib.contenttypes.models import ContentType
from apps.Escrow.models import Escrow
from .signals import create_wallet_for_new_user
from .services import get_live_exchange_rate
from datetime import datetime
from django.db.models import F
from django.utils.timezone import now, timedelta
from itertools import chain


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
        currency_to = request.data.get('currency_to', 'ETB')  # Default to ETB
        account_number= request.data.get('account_number', 'SENDER-PAYPAL-TEST')  # Default account number
        with transaction.atomic():
            # 1. Save the transfer instance
            transfer = serializer.save(sender=request.user)
            
            # 2. Calculate and set transaction fee
            transfer.transaction_fee = transfer.total_fee()
            
            # 4. Validate sender balance
            # try:
            sender_wallet, created = Wallet.objects.get_or_create(
                    account_number="SENDER-PAYPAL-TEST",
                    defaults={"balance": 10000, "currency": "USD"}
                )

            # except Wallet.DoesNotExist:
            #     raise serializers.ValidationError({"error": "Sender wallet not found."})

            total_deduct = transfer.amount + transfer.transaction_fee
            if sender_wallet.balance < total_deduct:
                raise serializers.ValidationError(
                    {"error": "Insufficient funds."},
                    code="insufficient_funds"
                )
            
            # 5. Update wallets
            sender_wallet.balance -= total_deduct
            sender_wallet.save()
            
            pmf_eth_wallet = Wallet.objects.get(account_number=account_number)
            pmf_eth_wallet.balance += transfer.amount
            pmf_eth_wallet.save()
            
            # 6. Log transaction and create escrow
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
                status='pending'  # Set initial status to 'in_escrow'
            )
            
            # Explicitly save transfer after all updates
            transfer.status = 'pending'  # Set status to 'in_escrow'
            transfer.save()

    
    def get_queryset(self):
        """
        Users can see only transactions where they are **senders**.
        """
        user = self.request.user
        if user.is_admin():
            return MoneyTransfer.objects.all()  # Admins can see all transactions
        return MoneyTransfer.objects.filter(sender=user)

    @action(detail=True, methods=['POST'])
    def cancel(self, request, pk=None):
        """
        Allow users to cancel their own **pending** money transfers.
        """
        money_transfer = self.get_object()

        # Only the sender can cancel their transaction
        if money_transfer.sender != request.user:
            return Response({"error": "You can only cancel your own transactions."}, status=status.HTTP_403_FORBIDDEN)

        if money_transfer.status != 'pending':
            return Response({"error": "Only pending transactions can be canceled."}, status=status.HTTP_400_BAD_REQUEST)

        money_transfer.status = 'canceled'
        money_transfer.save()
        return Response({"message": "Transaction canceled successfully."}, status=status.HTTP_200_OK)


class ForeignCurrencyRequestViewSet(viewsets.ModelViewSet):
    queryset = ForeignCurrencyRequest.objects.all()
    serializer_class = ForeignCurrencyRequestSerializer
    permission_classes = [IsReceiver]

    def perform_create(self, serializer):
        request = self.request
        with transaction.atomic():
            foreign_request = serializer.save(requester=request.user)
            foreign_request.transaction_fee = foreign_request.total_fee()
            foreign_request.save()

            # Fetch PMF EURO wallet (assuming it's your source pool for foreign currency)
            pmf_euro_wallet = Wallet.objects.get(account_number="PMF-EURO-PAYPAL")

            total_deduct = foreign_request.amount_requested + foreign_request.transaction_fee

            if pmf_euro_wallet.balance < total_deduct:
                raise PermissionDenied("Insufficient funds in PMF EURO account.")

            # Deduct from PMF EURO
            pmf_euro_wallet.balance -= total_deduct
            pmf_euro_wallet.save()

            # Log transaction
            TransactionLog.objects.create(
                source_account=pmf_euro_wallet.account_number,
                destination_account="Escrow",
                amount=foreign_request.amount_requested,
                description=f"Foreign Currency Request #{foreign_request.id} escrowed"
            )

            # Create Escrow
            Escrow.objects.create(
                content_type=ContentType.objects.get_for_model(foreign_request),
                object_id=foreign_request.id,
                amount=foreign_request.amount_requested
            )

            foreign_request.status = 'pending'
            foreign_request.save()

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
        # Fetch only USD→ETB and EUR→ETB
        usd_to_etb = get_live_exchange_rate("USD", "ETB")
        eur_to_etb = get_live_exchange_rate("EUR", "ETB")

        if not usd_to_etb or not eur_to_etb:
            return Response(
                {"error": "Exchange rates unavailable"}, 
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )

        # Format response to match dropdown UI
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
    def calculate_transaction_fee(self, request):  # Added 'self'
        amount = Decimal(request.GET.get('amount', 0))
        fee = amount * Decimal('0.02')
        return Response({'transaction_fee': str(fee)})
    
    
    
class MyTransactionViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

# permission_classes = [IsSender]
    @action(detail=False, methods=['get'], url_path='money-transfers',permission_classes=[IsSender])
    def money_transfers(self, request): 
        transfers = MoneyTransfer.objects.filter(sender=request.user).order_by('-created_at')
        serializer = MoneyTransferSerializer(transfers, many=True)
        return Response(serializer.data)
# permission_classes = [IsReceiver]
    @action(detail=False, methods=['get'], url_path='foreign-requests', permission_classes=[IsReceiver])
    def foreign_requests(self, request):
        requests = ForeignCurrencyRequest.objects.filter(requester=request.user).order_by('-created_at')
        serializer = ForeignCurrencyRequestSerializer(requests, many=True)
        return Response(serializer.data)
# permission_classes = [IsAuthenticated]
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
        
        
        


class ExchangeRateView(viewsets.ViewSet):
    queryset = ExchangeRate.objects.all()
    serializer_class = ExchangeRateSerializer
    permission_classes=[permissions.AllowAny]
    
    @action(detail=False, methods=['get'], url_path='live')
    def live_exchange_rate(self, request):
        currency_from = request.query_params.get("from")
        currency_to = request.query_params.get("to")

        if not currency_from or not currency_to:
            return Response(
                {"error": "Both 'from' and 'to' query parameters are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        rate = get_live_exchange_rate(currency_from.upper(), currency_to.upper())
        if rate is None:
            return Response(
                {"error": "Exchange rate not found for the provided currencies."},
                status=status.HTTP_404_NOT_FOUND
            )

        return Response({
            "from": currency_from.upper(),
            "to": currency_to.upper(),
            "rate": rate
        }, status=status.HTTP_200_OK)
        
        
class DailyExchangeRateViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = DailyExchangeRate.objects.all().order_by('-date')
    serializer_class = DailyExchangeRateSerializer

    @action(detail=False, methods=['get'], url_path='history')
    def history(self, request):
        base = request.query_params.get('base')
        target = request.query_params.get('target')
        date_from = request.query_params.get('from')
        date_to = request.query_params.get('to')

        if not all([base, target, date_from, date_to]):
            return Response(
                {"detail": "Missing required query params: base, target, from, to"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            from_date = datetime.strptime(date_from, "%Y-%m-%d").date()
            to_date = datetime.strptime(date_to, "%Y-%m-%d").date()
        except ValueError:
            return Response(
                {"detail": "Invalid date format. Use YYYY-MM-DD."},
                status=status.HTTP_400_BAD_REQUEST
            )

        rates_qs = DailyExchangeRate.objects.filter(
            date__range=(from_date, to_date)
        ).order_by('date')

        if not rates_qs.exists():
            return Response({"detail": "No rates found for given dates."}, status=404)

        history = []
        for rate_obj in rates_qs:
            base_rate = rate_obj.rates.get(base)
            target_rate = rate_obj.rates.get(target)
            if base_rate and target_rate:
                exchange_rate = target_rate / base_rate
                history.append({
                    "date": rate_obj.date,
                    "rate": exchange_rate
                })

        return Response({
            "base": base,
            "target": target,
            "history": history
        })
        
        
        
        
class CreateCurrencyAlertView(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = CurrencyAlertSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response({"message": "Alert created successfully."}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class UpdateCurrencyAlertView(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, pk):
        try:
            alert = CurrencyAlert.objects.get(pk=pk, user=request.user)
        except CurrencyAlert.DoesNotExist:
            return Response({"error": "Alert not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = CurrencyAlertSerializer(alert, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Alert updated.", "data": serializer.data}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DeleteCurrencyAlertView(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, pk):
        try:
            alert = CurrencyAlert.objects.get(pk=pk, user=request.user)
        except CurrencyAlert.DoesNotExist:
            return Response({"error": "Alert not found."}, status=status.HTTP_404_NOT_FOUND)
        
        alert.delete()
        return Response({"message": "Alert deleted."}, status=status.HTTP_204_NO_CONTENT)



class RecentTransactionViewSet(viewsets.ViewSet): 
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['GET'], url_path='recent-transactions')
    def recent_transactions(self, request):
        transaction_type = request.query_params.get('type')
        one_week_ago = now() - timedelta(days=7)

        if not transaction_type:
            return Response({"error": "type param is required (money_transfer | foreign_request)"}, status=400)

        if transaction_type == 'money_transfer':
            transactions = MoneyTransfer.objects.filter(created_at__gte=one_week_ago).order_by('-created_at')
            serializer = MoneyTransferSerializer(transactions, many=True)
        elif transaction_type == 'foreign_request':
            transactions = ForeignCurrencyRequest.objects.filter(created_at__gte=one_week_ago).order_by('-created_at')
            serializer = ForeignCurrencyRequestSerializer(transactions, many=True)
        else:
            return Response({"error": "Invalid type. Use 'money_transfer' or 'foreign_request'"}, status=400)

        return Response(serializer.data)