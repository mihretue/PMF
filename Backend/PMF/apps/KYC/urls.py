from django.urls import path
from .views import KYCCreateView, KYCAdminUpdateView, UserKYCStatusView


urlpatterns = [
   path('submit-kyc/', KYCCreateView.as_view(), name='submit-kyc'),
   path('status/', UserKYCStatusView.as_view(), name='kyc-status'),
   path('admin/update-kyc/<int:kyc_id>/', KYCAdminUpdateView.as_view(), name='update-kyc'),
]