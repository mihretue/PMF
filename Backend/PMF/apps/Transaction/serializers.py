from rest_framework import serializers
from .models import MoneyTransfer, Wallet,ForeignCurrencyRequest, ExchangeRate, TransactionLog, DailyExchangeRate, CurrencyAlert

class MoneyTransferSerializer(serializers.ModelSerializer):
    class Meta:
        model = MoneyTransfer
        fields = '__all__'
        read_only_fields = ['transaction_fee', 'status','created_at']  # Prevent users from modifying

    def create(self, validated_data):
        """Calculate transaction fee & exchange rate before saving."""
        money_transfer = MoneyTransfer(**validated_data)
        money_transfer.transaction_fee = money_transfer.total_fee()
        money_transfer.status = "pending"  # Default status
        money_transfer.save()
        return money_transfer


from rest_framework import serializers
from .models import ForeignCurrencyRequest

class ForeignCurrencyRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = ForeignCurrencyRequest
        fields = [
            'id',
            'requester',
            'amount_requested',
            'currency_type',
            'payment_method',
            'purpose',
            'urgency_level',
            'recipient_full_name',
            'recipient_account_number',
            'recipient_sort_code',
            'transaction_fee',
            'exchange_rate'
            'status',
            'created_at'
        ]
        read_only_fields = ['id', 'requester', 'transaction_fee', 'status', 'created_at']

class ExchangeRateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExchangeRate
        fields = '__all__' 
        
        
class WalletSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wallet
        fields = '__all__'

class TransactionLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = TransactionLog
        fields = '__all__'
        
        
class DailyExchangeRateSerializer(serializers.ModelSerializer):
    class Meta:
        model = DailyExchangeRate
        fields = ['id', 'date', 'base_code', 'rates', 'created_at']
        
class CurrencyAlertSerializer(serializers.ModelSerializer):
    class Meta:
        model = CurrencyAlert
        fields = [
            'id', 'base_currency', 'target_currency', 'min_rate', 'max_rate',
            'notify_interval', 'is_active', 'created_at', 'notified_at'
        ]
        read_only_fields = ['created_at', 'notified_at']
