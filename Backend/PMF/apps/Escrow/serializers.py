from rest_framework import serializers
from .models import Escrow
from django.contrib.contenttypes.models import ContentType

class EscrowSerializer(serializers.ModelSerializer):
    content_type = serializers.SlugRelatedField(
        slug_field='model',
        queryset=ContentType.objects.all()
    )

    class Meta:
        model = Escrow
        fields = '__all__'
        read_only_fields = ['status', 'created_at', 'updated_at']

    def create(self, validated_data):
        escrow = Escrow(**validated_data)
        escrow.status = 'pending'
        escrow.save()
        return escrow
