from rest_framework import serializers
from .models import KYC
import os

class KYCSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.email')
    
    class Meta:
        model = KYC
        fields = [
            'id', 'user', 'first_name', 'last_name', 'date_of_birth',
            'document_type', 'document_front', 'document_back',
            'verification_status', 'created_at', 'updated_at'
        ]
        read_only_fields = ['user', 'created_at', 'updated_at']

    def validate_document_type(self, value):
        valid_types = [choice[0] for choice in KYC.DOCUMENT_TYPES]
        if value not in valid_types:
            raise serializers.ValidationError(f"Document type must be one of: {', '.join(valid_types)}")
        return value

    def validate_document_front(self, value):
        if value:
            max_size = 5 * 1024 * 1024  # 5MB
            if hasattr(value, 'size') and value.size > max_size:
                raise serializers.ValidationError("Document front file size must be less than 5MB")
            valid_extensions = ['.jpg', '.jpeg', '.png', '.pdf']
            ext = os.path.splitext(value.name)[1].lower()
            if ext not in valid_extensions:
                raise serializers.ValidationError("Document front must be an image (JPG, PNG) or PDF")
        return value

    def validate_document_back(self, value):
        if value:
            max_size = 5 * 1024 * 1024  # 5MB
            if hasattr(value, 'size') and value.size > max_size:
                raise serializers.ValidationError("Document back file size must be less than 5MB")
            valid_extensions = ['.jpg', '.jpeg', '.png', '.pdf']
            ext = os.path.splitext(value.name)[1].lower()
            if ext not in valid_extensions:
                raise serializers.ValidationError("Document back must be an image (JPG, PNG) or PDF")
        return value

    def validate(self, data):
        document_type = data.get('document_type', getattr(self.instance, 'document_type', None))
        document_back = data.get('document_back', None)
        document_front = data.get('document_front', getattr(self.instance, 'document_front', None))

        # Ensure document_front is provided for new records
        if not document_front and not self.instance:
            raise serializers.ValidationError({"document_front": "This field is required."})

        # Document back validation
        if document_type:
            if document_type in ['national_id', 'driver_license', 'BRP'] and not document_back:
                raise serializers.ValidationError({"document_back": "This field is required for National ID, Driver License, or BRP."})
            if document_type == 'passport' and document_back is not None:
                raise serializers.ValidationError({"document_back": "Passport does not require a back document."})

        # Check for existing KYC record on create only
        request = self.context.get('request')
        if request and hasattr(request, 'user') and self.instance is None:
            if KYC.objects.filter(user=request.user).exists():
                raise serializers.ValidationError({"user": "A KYC record already exists for this user."})

        return data