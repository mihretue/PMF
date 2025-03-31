from rest_framework import serializers
from .models import MoneyTransfer, ForeignCurrencyRequest, ExchangeRate

class MoneyTransferSerializer(serializers.ModelSerializer):
    class Meta:
        model = MoneyTransfer
        fields = '__all__'
        read_only_fields = ['transaction_fee', 'exchange_rate', 'status']  # Prevent users from modifying

    def create(self, validated_data):
        """Calculate transaction fee & exchange rate before saving."""
        money_transfer = MoneyTransfer(**validated_data)
        money_transfer.transaction_fee = money_transfer.calculate_transaction_fee()
        money_transfer.exchange_rate = money_transfer.calculate_exchange_rate()
        money_transfer.status = "pending"  # Default status
        money_transfer.save()
        return money_transfer


class ForeignCurrencyRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = ForeignCurrencyRequest
        fields = '__all__'
        read_only_fields = ['status']  # Prevent users from modifying status

class ExchangeRateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExchangeRate
        fields = '__all__' 