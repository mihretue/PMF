from django.urls import path
from .views import RegisterView, LoginView, UserProfileView, LogoutView, VerifyOTPView, GenerateOTPView,GetUserProfileView, ProfilePictureUploadView,PasswordResetConfirmView, PasswordResetRequestView, ChangePasswordView, TotalUserView, DeleteAccountView, UpdateAccountView,UpdateProfileView
from rest_framework_simplejwt.views import TokenRefreshView


urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    path('generate-otp/',GenerateOTPView.as_view(), name='generate-otp'),
    path('verify-otp/', VerifyOTPView.as_view(), name= 'verify-otp'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('profile/', GetUserProfileView.as_view(), name='get_user_profile'),
    path('upload-profile-picture/', ProfilePictureUploadView.as_view(), name='upload-profile-picture'),
    path("password-reset/", PasswordResetRequestView.as_view(), name="password-reset"),
    path("password-reset-confirm/<uid>/<token>/", PasswordResetConfirmView.as_view(), name="password-reset-confirm"),
    path("change-password/", ChangePasswordView.as_view(), name="change-password"),
    path("total-users/", TotalUserView.as_view(),name='total-users'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('account/delete/', DeleteAccountView.as_view(), name='delete-account'),
    path('account/update/', UpdateAccountView.as_view(), name='update-account'),
    path('profile/update', UpdateProfileView.as_view(), name='update-profile')

]
