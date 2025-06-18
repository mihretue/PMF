from rest_framework import serializers
from .models import MoneyTransfer, Wallet,ForeignCurrencyRequest, ExchangeRate, TransactionLog, DailyExchangeRate, CurrencyAlert
from decimal import Decimal

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
    proof_document_url = serializers.SerializerMethodField()
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
            'exchange_rate',
            'status',
            'transaction_fee',
            'bank_fee',
            'pmf_fee',
            'bank_name',
            'proof_document',
            'proof_document_url',
            'created_at'
        ]
        read_only_fields = ['id', 'requester', 'transaction_fee', 'status','proof_document_url', 'created_at']
    
    def get_proof_document_url(self, obj):
        if obj.proof_document:
            return obj.proof_document.url
        return None
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
            'id', 'user', 'base_currency', 'target_currency',
            'target_rate', 'min_rate', 'max_rate',
            'is_active', 'notify_interval', 'created_at'
        ]
        read_only_fields = ['user', 'created_at']
        extra_kwargs = {
            'min_rate': {'required': False},
            'max_rate': {'required': False}
        }

    def validate(self, data):
        target_rate = data.get('target_rate')
        
        # If target_rate is provided, calculate min/max
        if target_rate is not None:
            threshold = Decimal('0.01')  # 1% threshold
            data['min_rate'] = Decimal(target_rate) * (1 - threshold)
            data['max_rate'] = Decimal(target_rate) * (1 + threshold)
        
        # If target_rate not provided, require both min and max
        elif 'min_rate' not in data or 'max_rate' not in data:
            raise serializers.ValidationError({
                'non_field_errors': [
                    "Either provide target_rate or both min_rate and max_rate"
                ]
            })
        
        # Ensure min_rate < max_rate
        if Decimal(data.get('min_rate', 0)) >= Decimal(data.get('max_rate', 0)):
            raise serializers.ValidationError({
                'non_field_errors': [
                    "min_rate must be less than max_rate"
                ]
            })
            
        return data