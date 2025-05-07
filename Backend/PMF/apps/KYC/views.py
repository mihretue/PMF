from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status, permissions
from .models import User, KYC
from .serializers import KYCSerializer
from apps.accounts.permissions import IsAdmin, IsSenderOrReceiver

class KYCCreateView(APIView):
    permission_classes = [IsSenderOrReceiver]

    def post(self, request):
        serializer = KYCSerializer(data=request.data, context={'request': request})  # 👈 pass context here
        if serializer.is_valid():
            serializer.save()  # 👈 no need for user=request.user
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserKYCStatusView(APIView):
    permission_classes = [IsSenderOrReceiver]

    def get(self, request):
        try:
            kyc = KYC.objects.get(user=request.user)
            return Response({
                "verification_status": kyc.verification_status
            }, status=status.HTTP_200_OK)
        except KYC.DoesNotExist:
            return Response({
                "verification_status": "Not Submitted"
            }, status=status.HTTP_404_NOT_FOUND)

class KYCAdminUpdateView(APIView):
    permission_classes = [IsAdmin]

    def patch(self, request, kyc_id):
        kyc = KYC.objects.get(id=kyc_id)
        kyc.verification_status = request.data.get("verification_status", kyc.verification_status)
        kyc.save()

        # Notify user via email (Optional)
        return Response({"message": "KYC status updated successfully"}, status=status.HTTP_200_OK)
