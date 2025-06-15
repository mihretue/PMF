from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MoneyTransferViewSet, ForeignCurrencyRequestViewSet, ExchangeRateViewSet, TransactionFeeViewSet, MyTransactionViewSet
from .views import MoneyTransferViewSet, ForeignCurrencyRequestViewSet, ExchangeRateViewSet, TransactionFeeViewSet, MyTransactionViewSet, ExchangeRateView, DailyExchangeRateViewSet

router = DefaultRouter()
router.register(r'money-transfers', MoneyTransferViewSet)
router.register(r'foreign-currency-requests', ForeignCurrencyRequestViewSet)
router.register(r'exchange-rates', ExchangeRateViewSet)
router.register(r'transaction-fees', TransactionFeeViewSet, basename='transaction-fee')
router.register(r'my-transactions', MyTransactionViewSet, basename='my-transactions')


router.register(r'get-exchange-rate',ExchangeRateView, basename='get-exchange-rate')
router.register(r'exchange-rate',DailyExchangeRateViewSet, basename='exchange-rate')
urlpatterns = [
    path('', include(router.urls)),
]
