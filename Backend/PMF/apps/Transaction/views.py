from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from .models import MoneyTransfer, ForeignCurrencyRequest, ExchangeRate
from .serializers import MoneyTransferSerializer, ForeignCurrencyRequestSerializer, ExchangeRateSerializer
from apps.accounts.permissions import IsSender, IsAdmin, IsAdminOrReceiver, IsAdminOrSender, IsSenderOrReceiver, IsReceiver

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
        """
        Custom logic before saving the money transfer.
        - Ensures user is authenticated.
        - Calculates transaction fee.
        - Applies exchange rate if applicable.
        """
        if not self.request.user.is_authenticated:
            raise PermissionDenied("You must be logged in to perform this action.")

        # Create transaction and assign sender
        money_transfer = serializer.save(sender=self.request.user)

        # Calculate transaction fee
        money_transfer.transaction_fee = money_transfer.calculate_transaction_fee()

        # Apply exchange rate if it's a money transfer
        money_transfer.exchange_rate = money_transfer.calculate_exchange_rate()

        money_transfer.save()

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
    """
    API for handling Foreign Currency Requests.
    - Receivers can request foreign currency.
    - Admins can approve or reject requests.
    """
    queryset = ForeignCurrencyRequest.objects.all()
    serializer_class = ForeignCurrencyRequestSerializer
    permission_classes = [IsReceiver]

    def perform_create(self, serializer):
        """
        Ensure only receivers can request foreign currency.
        """
        if not self.request.user.is_authenticated:
            raise PermissionDenied("You must be logged in to perform this action.")

        foreign_request = serializer.save(requester=self.request.user)
        foreign_request.save()

    def get_queryset(self):
        """
        Users can see only their own **foreign currency requests**.
        """
        user = self.request.user
        if user.is_admin():
            return ForeignCurrencyRequest.objects.all()  # Admins can see all requests
        return ForeignCurrencyRequest.objects.filter(requester=user)

    @action(detail=True, methods=['POST'])
    def approve(self, request, pk=None):
        """
        Allow Admins to approve foreign currency requests.
        """
        if not request.user.is_admin():
            return Response({"error": "Only admins can approve requests."}, status=status.HTTP_403_FORBIDDEN)

        foreign_request = self.get_object()

        if foreign_request.status != 'pending':
            return Response({"error": "Only pending requests can be approved."}, status=status.HTTP_400_BAD_REQUEST)

        foreign_request.status = 'approved'
        foreign_request.save()
        return Response({"message": "Foreign Currency Request approved successfully."}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['POST'])
    def reject(self, request, pk=None):
        """
        Allow Admins to reject foreign currency requests.
        """
        if not request.user.is_admin():
            return Response({"error": "Only admins can reject requests."}, status=status.HTTP_403_FORBIDDEN)

        foreign_request = self.get_object()

        if foreign_request.status != 'pending':
            return Response({"error": "Only pending requests can be rejected."}, status=status.HTTP_400_BAD_REQUEST)

        foreign_request.status = 'rejected'
        foreign_request.save()
        return Response({"message": "Foreign Currency Request rejected."}, status=status.HTTP_200_OK)


class ExchangeRateViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API for retrieving exchange rates.
    """
    queryset = ExchangeRate.objects.all()
    serializer_class = ExchangeRateSerializer
    permission_classes = [permissions.AllowAny]  # Anyone can access exchange rates
