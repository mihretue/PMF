from rest_framework import serializers
from .models import PaymentTransaction
from django.contrib.contenttypes.models import ContentType

class PaymentTransactionSerializer(serializers.ModelSerializer):
    content_type = serializers.SlugRelatedField(
        slug_field='model',
        queryset=ContentType.objects.all()
    )

    class Meta:
        model = PaymentTransaction
        fields = '__all__'
        read_only_fields = ['status', 'created_at']
