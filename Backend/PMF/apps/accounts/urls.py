from django.urls import path
from .views import RegisterView, LoginView, UserProfileView, LogoutView, VerifyOTPView, GenerateOTPView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    path('generate-otp/',GenerateOTPView.as_view(), name='generate-otp'),
    path('verify-otp/', VerifyOTPView.as_view(), name= 'verify-otp')
]
