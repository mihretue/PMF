from django.db.models import Count, Q
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.generics import ListAPIView
from .models import KYC
from .serializers import KYCSerializer
from apps.accounts.permissions import IsAdmin, IsSenderOrReceiver


class KYCCreateView(APIView):
    permission_classes = [IsSenderOrReceiver]

    def post(self, request):
        serializer = KYCSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save(user=request.user)
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

class KYCUpdateView(APIView):
    """PUT endpoint for full KYC updates"""
    permission_classes = [IsSenderOrReceiver]

    def get_kyc(self, user):
        try:
            return KYC.objects.get(user=user)
        except KYC.DoesNotExist:
            return None

    def put(self, request):
        kyc = self.get_kyc(request.user)
        if not kyc:
            return Response({
                'status': 'error',
                'message': 'KYC record not found'
            }, status=status.HTTP_404_NOT_FOUND)

        if kyc.verification_status != "pending":
            return Response({
                'status': 'error',
                'message': 'Only pending KYC can be modified'
            }, status=status.HTTP_403_FORBIDDEN)

        serializer = KYCSerializer(
            kyc, 
            data=request.data, 
            partial=False,
            context={'request': request}
        )
        
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
    """PATCH endpoint for partial KYC updates"""
    permission_classes = [IsSenderOrReceiver]

    def get_kyc(self, user):
        try:
            return KYC.objects.get(user=user)
        except KYC.DoesNotExist:
            return None

    def patch(self, request):
        kyc = self.get_kyc(request.user)
        if not kyc:
            return Response({
                'status': 'error',
                'message': 'KYC record not found'
            }, status=status.HTTP_404_NOT_FOUND)

        if kyc.verification_status != "pending":
            return Response({
                'status': 'error',
                'message': 'Only pending KYC can be modified'
            }, status=status.HTTP_403_FORBIDDEN)

        serializer = KYCSerializer(
            kyc,
            data=request.data,
            partial=True,
            context={'request': request}
        )
        
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

        serializer = KYCSerializer(
            kyc,
            data=request.data,
            partial=True,
            context={'request': request}
        )
        
        if serializer.is_valid():
            serializer.save()
            return Response({
                'status': 'success',
                'data': serializer.data,
                'message': 'Admin KYC update successful'
            })
            
        return Response({
            'status': 'error',
            'errors': serializer.errors,
            'message': 'Admin validation failed'
        }, status=status.HTTP_400_BAD_REQUEST)

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