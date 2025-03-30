from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MoneyTransferViewSet, ForeignCurrencyRequestViewSet, ExchangeRateViewSet

router = DefaultRouter()
router.register(r'money-transfers', MoneyTransferViewSet)
router.register(r'foreign-currency-requests', ForeignCurrencyRequestViewSet)
router.register(r'exchange-rates', ExchangeRateViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
