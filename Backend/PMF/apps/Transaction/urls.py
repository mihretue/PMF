from rest_framework.routers import DefaultRouter
from .views import MoneyTransferViewSet, ForeignCurrencyRequestViewSet, ExchangeRateViewSet, TransactionFeeViewSet, MyTransactionViewSet, ExchangeRateView, DailyExchangeRateViewSet, RecentTransactionViewSet,StatusCountViewSet,DeleteCurrencyAlertView, CreateCurrencyAlertView, UpdateCurrencyAlertView
from django.urls import path, include

router = DefaultRouter()
router.register(r'money-transfers', MoneyTransferViewSet)
router.register(r'foreign-currency-requests', ForeignCurrencyRequestViewSet)
router.register(r'exchange-rates', ExchangeRateViewSet)
router.register(r'transaction-fees', TransactionFeeViewSet, basename='transaction-fee')
router.register(r'my-transactions', MyTransactionViewSet, basename='my-transactions')
router.register(r'get-exchange-rate',ExchangeRateView, basename='get-exchange-rate')
router.register(r'exchange-rate',DailyExchangeRateViewSet, basename='exchange-rate')
router.register(r'need', RecentTransactionViewSet, basename="need")
router.register(r'status-counts', StatusCountViewSet, basename='status-counts')
router.register(r'currency-alerts', DeleteCurrencyAlertView, basename='currency-alerts')
router.register(r'currency-alerts-create', CreateCurrencyAlertView, basename='currency-alerts-creat')
router.register(r'currency-alerts-update', UpdateCurrencyAlertView, basename='currency-alerts-updat')

urlpatterns = [
    # Currency Alert endpoints (explicit so you can POST, PATCH, DELETE easily)
    path('currency-alerts/', CreateCurrencyAlertView.as_view({'post': 'post'}), name='currency-alert-create'),
    path('currency-alerts/<int:pk>/', UpdateCurrencyAlertView.as_view({'patch': 'patch'}), name='currency-alert-update'),
    path('currency-alerts/<int:pk>/delete/', DeleteCurrencyAlertView.as_view({'delete': 'delete'}), name='currency-alert-delete'),
    # All other endpoints
    path('', include(router.urls)),
]