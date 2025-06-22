from rest_framework import serializers
from .models import (
    MoneyTransfer, Wallet, ForeignCurrencyRequest, ExchangeRate,
    TransactionLog, DailyExchangeRate, CurrencyAlert
)
from decimal import Decimal

class MoneyTransferSerializer(serializers.ModelSerializer):
    class Meta:
        model = MoneyTransfer
        fields = '__all__'
        read_only_fields = ['transaction_fee', 'status', 'created_at']

    def create(self, validated_data):
        """Calculate transaction fee & exchange rate before saving."""
        money_transfer = MoneyTransfer(**validated_data)
        money_transfer.transaction_fee = money_transfer.total_fee()
        money_transfer.status = "pending"
        money_transfer.save()
        return money_transfer


class ForeignCurrencyRequestSerializer(serializers.ModelSerializer):
    proof_document_url = serializers.SerializerMethodField()

    class Meta:
        model = ForeignCurrencyRequest
        fields = [
            'id', 'requester', 'amount_requested', 'currency_type', 'payment_method',
            'purpose', 'urgency_level', 'recipient_full_name', 'recipient_account_number',
            'recipient_sort_code', 'transaction_fee', 'exchange_rate', 'status',
            'bank_fee', 'pmf_fee', 'bank_name', 'proof_document', 'proof_document_url',
            'created_at'
        ]
        read_only_fields = [
            'id', 'requester', 'transaction_fee', 'status', 'proof_document_url', 'created_at'
        ]

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
        # Accept either a target_rate, or both min_rate and max_rate
        target_rate = data.get('target_rate')
        min_rate = data.get('min_rate')
        max_rate = data.get('max_rate')
        threshold = Decimal('0.01')  # 1% threshold

        if target_rate is not None:
            data['min_rate'] = Decimal(target_rate) * (1 - threshold)
            data['max_rate'] = Decimal(target_rate) * (1 + threshold)
        elif min_rate is not None and max_rate is not None:
            if Decimal(min_rate) >= Decimal(max_rate):
                raise serializers.ValidationError(
                    {"non_field_errors": ["min_rate must be less than max_rate"]}
                )
        else:
            raise serializers.ValidationError(
                {"non_field_errors": ["Either provide target_rate or both min_rate and max_rate"]}
            )

        return data