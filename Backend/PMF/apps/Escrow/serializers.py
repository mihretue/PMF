from rest_framework import serializers
from .models import Escrow

class EscrowSerializer(serializers.ModelSerializer):
    class Meta:
        model = Escrow
        fields = '__all__'
        read_only_fields = ['status', 'created_at', 'updated_at']  # Prevent users from modifying these fields

    def create(self, validated_data):
        """Override create method to set default status."""
        escrow = Escrow(**validated_data)
        escrow.status = 'pending'  # Default status
        escrow.save()
        return escrow

    def update(self, instance, validated_data):
        """Override update method to prevent changing certain fields."""
        instance.amount = validated_data.get('amount', instance.amount)
        instance.save()
        return instance