from rest_framework import serializers
from .models import KYC

class KYCSerializer(serializers.ModelSerializer):
    class Meta:
        model = KYC
        fields = '__all__'
        extra_kwargs = {
            'user': {'read_only': True}
        }

    def validate(self, data):
        """
        Ensure document_back is required only for certain document types.
        """
        document_type = data.get("document_type")
        document_back = data.get("document_back")

        if document_type in ["national_id", "driver_license","BPR"] and not document_back:
            raise serializers.ValidationError({"document_back": "This field is required for National ID or Driver License or BPR."})

        if document_type == "passport" and document_back:
            raise serializers.ValidationError({"document_back": "Passport does not require a back document."})

        return data
    def create(self, validated_data):
        # Automatically set the user to the current authenticated user
        user = self.context['request'].user  # Access the user from the request context
        validated_data['user'] = user
        return super().create(validated_data)
