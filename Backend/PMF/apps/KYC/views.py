from django.db.models import Count, Q
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.generics import ListAPIView
from .models import KYC
from .serializers import KYCSerializer
from apps.accounts.permissions import IsAdmin, IsSenderOrReceiver
from apps.Notifications.models import Notification


class KYCCreateView(APIView):
    permission_classes = [IsSenderOrReceiver]

    def post(self, request):
        serializer = KYCSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            kyc = serializer.save(user=request.user)

            # Notify user on KYC submission
            try:
                Notification.objects.create(
                    user=request.user,
                    message="Your KYC has been submitted and is under review."
                )
            except Exception:
                pass

            return Response({
                'status': 'success',
                'data': serializer.data,
                'message': 'KYC submitted successfully'
            }, status=status.HTTP_201_CREATED)

        return Response({
            'status': 'error',
            'errors': serializer.errors,
            'message': 'KYC submission failed'
        }, status=status.HTTP_400_BAD_REQUEST)


class UserKYCStatusView(APIView):
    permission_classes = [IsSenderOrReceiver]

    def get(self, request):
        try:
            kyc = KYC.objects.get(user=request.user)
            return Response({
                'status': 'success',
                'verification_status': kyc.verification_status,
                'message': 'KYC status retrieved'
            })
        except KYC.DoesNotExist:
            return Response({
                'status': 'success',
                'verification_status': 'not_submitted',
                'message': 'No KYC submission found'
            })


class KYCAdminUpdateView(APIView):
    permission_classes = [IsAdmin]

    def patch(self, request, kyc_id):
        try:
            kyc = KYC.objects.get(id=kyc_id)
        except KYC.DoesNotExist:
            return Response({
                'status': 'error',
                'message': 'KYC record not found'
            }, status=status.HTTP_404_NOT_FOUND)

        old_status = kyc.verification_status
        serializer = KYCSerializer(kyc, data=request.data, partial=True, context={'request': request})

        if serializer.is_valid():
            serializer.save()

            # Notify user if status changed
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

            return Response({
                'status': 'success',
                'data': serializer.data,
                'message': 'KYC status updated successfully'
            }, status=status.HTTP_200_OK)

        return Response({
            'status': 'error',
            'errors': serializer.errors,
            'message': 'Validation failed'
        }, status=status.HTTP_400_BAD_REQUEST)


class KYCUpdateView(APIView):
    permission_classes = [IsSenderOrReceiver]

    def put(self, request):
        try:
            kyc = KYC.objects.get(user=request.user)
        except KYC.DoesNotExist:
            return Response({
                'status': 'error',
                'message': 'KYC record not found'
            }, status=status.HTTP_404_NOT_FOUND)

        if kyc.verification_status != "pending":
            return Response({
                'status': 'error',
                'message': 'Only pending KYC can be modified'
            }, status=status.HTTP_403_FORBIDDEN)

        serializer = KYCSerializer(kyc, data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response({
                'status': 'success',
                'data': serializer.data,
                'message': 'KYC fully updated'
            })
        return Response({
            'status': 'error',
            'errors': serializer.errors,
            'message': 'Full update validation failed'
        }, status=status.HTTP_400_BAD_REQUEST)


class KYCPartialUpdateView(APIView):
    permission_classes = [IsSenderOrReceiver]

    def patch(self, request):
        try:
            kyc = KYC.objects.get(user=request.user)
        except KYC.DoesNotExist:
            return Response({
                'status': 'error',
                'message': 'KYC record not found'
            }, status=status.HTTP_404_NOT_FOUND)

        if kyc.verification_status != "pending":
            return Response({
                'status': 'error',
                'message': 'Only pending KYC can be modified'
            }, status=status.HTTP_403_FORBIDDEN)

        serializer = KYCSerializer(kyc, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response({
                'status': 'success',
                'data': serializer.data,
                'message': 'KYC partially updated'
            })
        return Response({
            'status': 'error',
            'errors': serializer.errors,
            'message': 'Partial update validation failed'
        }, status=status.HTTP_400_BAD_REQUEST)


class UserKYCDetailView(APIView):
    permission_classes = [IsSenderOrReceiver]

    def get(self, request):
        try:
            kyc = KYC.objects.get(user=request.user)
            serializer = KYCSerializer(kyc)
            return Response({
                'status': 'success',
                'data': serializer.data,
                'message': 'KYC details retrieved'
            })
        except KYC.DoesNotExist:
            return Response({
                'status': 'error',
                'message': 'KYC record not found'
            }, status=status.HTTP_404_NOT_FOUND)


class KYCListView(ListAPIView):
    permission_classes = [IsAdmin]
    serializer_class = KYCSerializer
    queryset = KYC.objects.all().order_by('-created_at')

    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)
        return Response({
            'status': 'success',
            'count': len(response.data),
            'data': response.data,
            'message': 'KYC list retrieved'
        })


class KYCTotalsView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request):
        totals = KYC.objects.aggregate(
            total=Count('id'),
            pending=Count('id', filter=Q(verification_status='pending')),
            approved=Count('id', filter=Q(verification_status='approved')),
            rejected=Count('id', filter=Q(verification_status='rejected'))
        )
        return Response({
            'status': 'success',
            'data': {
                'total': totals['total'],
                'pending': totals['pending'],
                'approved': totals['approved'],
                'rejected': totals['rejected']
            },
            'message': 'KYC statistics retrieved'
        })
