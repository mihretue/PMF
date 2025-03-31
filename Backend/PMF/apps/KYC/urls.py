from django.urls import path
from .views import KYCCreateView, KYCAdminUpdateView


urlpatterns = [
   path('submit-kyc/', KYCCreateView.as_view(), name='submit-kyc'),
   path('admin/update-kyc/<int:kyc_id>/', KYCAdminUpdateView.as_view(), name='update-kyc'),
]