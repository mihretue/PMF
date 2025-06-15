from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status, permissions
from .models import User, KYC
from .serializers import KYCSerializer
from apps.accounts.permissions import IsAdmin, IsSenderOrReceiver
from rest_framework.generics import ListAPIView

# 🟢 Import Notification model
from apps.Notifications.models import Notification

class KYCCreateView(APIView):
    permission_classes = [IsSenderOrReceiver]

    def post(self, request):
        serializer = KYCSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
<<<<<<< HEAD
            kyc_instance = serializer.save()
            # 🟢 Notify user on KYC submission
            try:
                Notification.objects.create(
                    user=request.user,
                    message="Your KYC has been submitted and is under review."
                )
            except Exception:
                pass
=======
            serializer.save(user=request.user)  # 👈 no need for user=request.user
>>>>>>> 9ea46b6d192e059935e587489c47d02cb0c95f28
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
<<<<<<< HEAD
        kyc = KYC.objects.get(id=kyc_id)
        old_status = kyc.verification_status
        kyc.verification_status = request.data.get("verification_status", kyc.verification_status)
        kyc.save()

        # 🟢 Notify user on KYC status change
        if kyc.verification_status != old_status:
            try:
                if kyc.verification_status == 'approved':
                    message = "Your KYC has been approved. You can now access all services."
                elif kyc.verification_status == 'rejected':
                    message = "Your KYC was rejected. Please review your documents and resubmit."
                else:
                    message = f"Your KYC status is now '{kyc.verification_status}'."

                Notification.objects.create(
                    user=kyc.user,
                    message=message
                )
            except Exception:
                pass

        return Response({"message": "KYC status updated successfully"}, status=status.HTTP_200_OK)
=======
        try:
            kyc = KYC.objects.get(id=kyc_id)
        except KYC.DoesNotExist:
            return Response({"error": "KYC record not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = KYCSerializer(kyc, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response({
                "message": "KYC status updated successfully",
                "data": serializer.data
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
#Put request
>>>>>>> 9ea46b6d192e059935e587489c47d02cb0c95f28

class KYCUpdateView(APIView):
    permission_classes = [IsSenderOrReceiver]

    def put(self, request):
        try:
            kyc = KYC.objects.get(user=request.user)
        except KYC.DoesNotExist:
            return Response({"error": "KYC record not found."}, status=status.HTTP_404_NOT_FOUND)

        if kyc.verification_status != "pending":
            return Response({"error": "KYC cannot be edited as it is not in 'Pending' status."},
                            status=status.HTTP_403_FORBIDDEN)

        serializer = KYCSerializer(kyc, data=request.data, partial=False, context={'request': request})

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class KYCPartialUpdateView(APIView):
    permission_classes = [IsSenderOrReceiver]

    def patch(self, request):
        try:
            kyc = KYC.objects.get(user=request.user)
        except KYC.DoesNotExist:
            return Response({"error": "KYC record not found."}, status=status.HTTP_404_NOT_FOUND)

        if kyc.verification_status != "pending":
            return Response({"error": "KYC cannot be edited as it is not in 'Pending' status."},
                            status=status.HTTP_403_FORBIDDEN)

        serializer = KYCSerializer(kyc, data=request.data, partial=True, context={'request': request})

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserKYCDetailView(APIView):
    permission_classes = [IsSenderOrReceiver]

    def get(self, request):
        try:
            kyc = KYC.objects.get(user=request.user)
            serializer = KYCSerializer(kyc)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except KYC.DoesNotExist:
<<<<<<< HEAD
            return Response({"error": "KYC record not found."}, status=status.HTTP_404_NOT_FOUND)
=======
            return Response({"error": "KYC record not found."}, status=status.HTTP_404_NOT_FOUND)


class KYCListView(ListAPIView):
    permissions_classes = [IsAdmin]
    queryset = KYC.objects.all().order_by('-created_at')
    serializer_class = KYCSerializer
    


class KYCTotalsView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request):
        totals = KYC.objects.aggregate(
            total=Count('id'),
            pending=Count('id', filter=models.Q(verification_status='pending')),
            approved=Count('id', filter=models.Q(verification_status='approved')),
            rejected=Count('id', filter=models.Q(verification_status='rejected'))
        )
        return Response({
            "total_applications": totals['total'],
            "pending_total": totals['pending'],
            "approved_total": totals['approved'],
            "rejected_total": totals['rejected']
        }, status=status.HTTP_200_OK)
>>>>>>> 9ea46b6d192e059935e587489c47d02cb0c95f28
