from rest_framework import serializers
from .models import KYC

class KYCSerializer(serializers.ModelSerializer):
    class Meta:
        model = KYC
        fields = '__all__'

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
