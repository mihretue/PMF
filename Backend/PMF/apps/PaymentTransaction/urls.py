from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PayPalWebhookView, PaymentTransactionViewSet

router = DefaultRouter()
router.register(r'transactions', PaymentTransactionViewSet, basename='paymenttransaction')

urlpatterns = [
    path('paypal/webhook/', PayPalWebhookView.as_view(), name='paypal-webhook'),
    path('', include(router.urls)),
]
