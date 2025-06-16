from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.contenttypes.models import ContentType
from .models import PaymentTransaction
from apps.Escrow.models import Escrow
from .serializers import PaymentTransactionSerializer

# 🟢 Import Notification model
from apps.Notifications.models import Notification

class PaymentTransactionViewSet(viewsets.ModelViewSet):
    queryset = PaymentTransaction.objects.all()
    serializer_class = PaymentTransactionSerializer

class PayPalWebhookView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request, *args, **kwargs):
        data = request.data

        transaction_id = data.get("transaction_id")
        amount = data.get("amount")
        sender_id = data.get("sender_id")
        transaction_type = data.get("transaction_type")
        object_id = data.get("object_id")

        if not all([transaction_id, transaction_type, object_id]):
            return Response({"error": "Missing required fields."}, status=400)

        try:
            content_type = ContentType.objects.get(model=transaction_type)
            txn = content_type.get_object_for_this_type(id=object_id)
        except:
            return Response({"error": "Transaction not found."}, status=404)

        payment = PaymentTransaction.objects.create(
            provider='paypal',
            transaction_id=transaction_id,
            sender_id=sender_id,
            content_type=content_type,
            object_id=object_id,
            amount=amount,
            status='completed'
        )

        # Notification for completed payment
        try:
            if payment.sender:
                Notification.objects.create(
                    user=payment.sender,
                    message=f"Your payment (Transaction ID: {payment.transaction_id}) of ${payment.amount} has been received and is in escrow."
                )
        except Exception as e:
            pass

        if not hasattr(txn, 'escrow'):
            Escrow.objects.create(
                content_type=content_type,
                object_id=object_id,
                amount=amount,
                status='in_escrow'
            )

        return Response({"message": "Payment logged and escrow created."}, status=200)