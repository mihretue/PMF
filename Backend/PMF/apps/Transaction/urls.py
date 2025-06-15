from django.urls import path, include
from rest_framework.routers import DefaultRouter
<<<<<<< HEAD
from .views import MoneyTransferViewSet, ForeignCurrencyRequestViewSet, ExchangeRateViewSet, TransactionFeeViewSet, MyTransactionViewSet
=======
from .views import MoneyTransferViewSet, ForeignCurrencyRequestViewSet, ExchangeRateViewSet, TransactionFeeViewSet, MyTransactionViewSet, ExchangeRateView, DailyExchangeRateViewSet
>>>>>>> 9ea46b6d192e059935e587489c47d02cb0c95f28

router = DefaultRouter()
router.register(r'money-transfers', MoneyTransferViewSet)
router.register(r'foreign-currency-requests', ForeignCurrencyRequestViewSet)
router.register(r'exchange-rates', ExchangeRateViewSet)
router.register(r'transaction-fees', TransactionFeeViewSet, basename='transaction-fee')
router.register(r'my-transactions', MyTransactionViewSet, basename='my-transactions')
<<<<<<< HEAD


=======
router.register(r'get-exchange-rate',ExchangeRateView, basename='get-exchange-rate')
router.register(r'exchange-rate',DailyExchangeRateViewSet, basename='exchange-rate')
>>>>>>> 9ea46b6d192e059935e587489c47d02cb0c95f28
urlpatterns = [
    path('', include(router.urls)),
]
