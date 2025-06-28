from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate, get_user_model
from rest_framework.authtoken.models import Token
from .serializers import UserSerializer, RegisterSerializer
from oauth2_provider.models import AccessToken
import random
from django.core.mail import send_mail
from django.conf import settings
from datetime import timezone, timedelta
from django.utils.timezone import now
from .models import OTP, User
from twilio.rest import Client
import hashlib
import requests
from django.core.cache import cache
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from rest_framework.parsers import MultiPartParser, FormParser
from cloudinary.utils import cloudinary_url
import logging
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
from django.contrib.auth.tokens import default_token_generator
from django.contrib.sites.shortcuts import get_current_site
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth.password_validation import validate_password
from .permissions import IsAdmin, IsActiveOrDeleting

# 🟢 Import Notification model
from apps.Notifications.models import Notification

User = get_user_model()
logger = logging.getLogger(__name__)

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        logger.debug(f"Received payload: {request.data}")

        try:
            response = super().create(request, *args, **kwargs)
            user = User.objects.get(email=request.data["email"])

            # 🟢 Notification: Welcome after registration
            try:
                Notification.objects.create(
                    user=user,
                    message="Welcome! Your account was created successfully."
                )
            except Exception as notify_error:
                logger.warning(f"an error occurred: {notify_error}")

            refresh = RefreshToken.for_user(user)
            logger.info(f"User registered successfully: {user.email}")

            return Response({
                "access_token": str(refresh.access_token),
                "refresh_token": str(refresh),
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid()  # Run validation to get errors
            logger.error(f"Registration failed: {str(e)} | Validation errors: {serializer.errors} | Payload: {request.data}")
            raise       

class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")
        auth_type = request.headers.get("Authorization", "").split(" ")[0]

        print("Authorization Header:", request.headers.get("Authorization"))  # Debugging

        if auth_type not in ["Bearer", "JWT"]:
            return Response({"error": "Please specify authentication type (jwt or oauth2)"}, status=400)

        # OAuth2 Authentication
        if auth_type == "Bearer":
            token = request.data.get("token")
            try:
                access_token = AccessToken.objects.get(token=token)
                user = access_token.user
                # 🟢 Notification: Successful login (optional)
                try:
                    Notification.objects.create(
                        user=user,
                        message="You have logged in successfully."
                    )
                except Exception as notify_error:
                    logger.warning(f"Could not create notification: {notify_error}")

                return Response({"message": f"Welcome, {user.full_name}"})
            except AccessToken.DoesNotExist:
                return Response({"error": "Invalid OAuth2 token"}, status=400)

        # JWT Authentication
        elif auth_type == "JWT":
            user = User.objects.filter(email=email).first()
            if user and user.check_password(password):
                refresh = RefreshToken.for_user(user)
                # 🟢 Notification: Successful login (optional)
                try:
                    Notification.objects.create(
                        user=user,
                        message="You have logged in successfully."
                    )
                except Exception as notify_error:
                    logger.warning(f"Could not create notification: {notify_error}")

                return Response({
                    'access_token': str(refresh.access_token),
                    'refresh_token': str(refresh),
                    user.id: user.id,
                })
            return Response({"error": "Invalid credentials"}, status=400)

        return Response({"error": "Authentication type not recognized"}, status=400)

class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")

            if not refresh_token:
                return Response({"error": "Refresh token is required."}, status=status.HTTP_400_BAD_REQUEST)

            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response({"detail": "Successfully logged out."}, status=status.HTTP_205_RESET_CONTENT)

        except (TokenError, InvalidToken) as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class UserProfileView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

def generate_otp():
    return str(random.randint(100000,999999))

class GenerateOTPView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        subject = request.data.get("subject")
        email = request.data.get("email")

        if not subject or not email:
            return Response(
                {"error": "Subject and recipient email are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = User.objects.filter(email=email).first()
        if not user:
            return Response({"error": "User not found"}, status=status.HTTP_400_BAD_REQUEST)

        existing_otp = OTP.objects.filter(
            user=user,
            is_used=False,
            expires_at__gt=now()
        ).first()

        if existing_otp:
            return Response(
                {"error": "An OTP has already been sent. Please wait before requesting another."},
                status=status.HTTP_429_TOO_MANY_REQUESTS
            )

        otp = generate_otp()  # plain 6-digit OTP

        OTP.objects.create(user=user, code=otp, expires_at=now() + timedelta(minutes=5))

        message = f"Your OTP is {otp}. It expires in 5 minutes."

        try:
            send_mail(subject, message, from_email=None, recipient_list=[email], fail_silently=False)
            return Response({'message': 'OTP sent successfully via email'}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class VerifyOTPView(APIView):
    def post(self, request):
        email = request.data.get("email")
        otp_input = request.data.get("otp")

        user = User.objects.filter(email=email).first()
        if not user:
            return Response({"error": "User not found"}, status=status.HTTP_400_BAD_REQUEST)

        otp_instance = OTP.objects.filter(user=user, is_used=False, expires_at__gt=now()).order_by("-created_at").first()
        if not otp_instance:
            return Response({"error": "No OTP found or it has expired."}, status=status.HTTP_400_BAD_REQUEST)

        if not otp_instance.verify_otp(otp_input):
            return Response({"error": "Invalid OTP"}, status=status.HTTP_400_BAD_REQUEST)

        otp_instance.is_used = True
        otp_instance.save()

        user.is_verified = True
        user.save()

        cache.delete(email)

        # 🟢 Notification: OTP verified
        try:
            Notification.objects.create(
                user=user,
                message="Your account has been verified via OTP."
            )
        except Exception as notify_error:
            logger.warning(f"Could not create notification: {notify_error}")

        return Response({"message": "OTP verified successfully!"}, status=status.HTTP_200_OK)

class ResendOTPView(APIView):
    def post(self, request):
        email = request.data.get("email")
        user = User.objects.filter(email=email).first()

        if not user:
            return Response({"error": "User not found"}, status=status.HTTP_400_BAD_REQUEST)

        otp_instance = OTP.objects.filter(user=user, is_used=False, expires_at__gt=now()).first()
        if otp_instance:
            return Response({"error": "An OTP has already been sent. Please wait before requesting another."}, status=status.HTTP_429_TOO_MANY_REQUESTS)

        return GenerateOTPView.as_view()(request)

class GetUserProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class ProfilePictureUploadView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def patch(self, request, *args, **kwargs):
        user = request.user
        profile_picture = request.FILES.get('profile_picture')

        if profile_picture:
            user.profile_picture = profile_picture
            user.save()

            image_url = user.profile_picture.url

            # 🟢 Notification: Profile picture updated
            try:
                Notification.objects.create(
                    user=user,
                    message="Your profile picture was updated."
                )
            except Exception as notify_error:
                logger.warning(f"Could not create notification: {notify_error}")

            return Response({
                "message": "Profile picture updated successfully.",
                "profile_picture_url": image_url
            })
        else:
            return Response({"error": "No image uploaded."}, status=400)

class PasswordResetRequestView(APIView):
    permission_classes = [permissions.AllowAny]
    def post(self, request):
        email = request.data.get("email")
        user = User.objects.filter(email=email).first()
        if user:
            token = default_token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            reset_link = f"https://pmf-demo.vercel.app/forgot-password/{uid}/{token}/"
            send_mail(
                "Password Reset",
                f"Use this link to reset your password: {reset_link}",
                "no-reply@pmf-demo.com",
                [email],
            )
        return Response({"message": "If this email exists, a reset link was sent."})
    
class PasswordResetConfirmView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, uid, token):
        try:
            uid = urlsafe_base64_decode(uid).decode()
            user = User.objects.get(pk=uid)
        except (User.DoesNotExist, ValueError, TypeError, OverflowError):
            return Response({"error": "Invalid reset link."}, status=400)

        if not default_token_generator.check_token(user, token):
            return Response({"error": "Invalid or expired token."}, status=400)

        new_password = request.data.get("new_password")
        if not new_password:
            return Response({"error": "New password is required."}, status=400)

        try:
            validate_password(new_password, user=user)
        except DjangoValidationError as e:
            return Response({"error": e.messages}, status=400)

        user.set_password(new_password)
        user.save()

        # 🟢 Notification: Password reset
        try:
            Notification.objects.create(
                user=user,
                message="Your password was reset successfully."
            )
        except Exception as notify_error:
            logger.warning(f"Could not create notification: {notify_error}")

        return Response({"message": "Password has been reset successfully."})
   
class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        current_password = request.data.get("current_password")
        new_password = request.data.get("new_password")

        if not user.check_password(current_password):
            return Response({"error": "Current password is incorrect."}, status=400)
        
        if not new_password:
            return Response({"error": "New password is required."}, status=400)
        
        user.set_password(new_password)
        user.save()

        # 🟢 Notification: Password change
        try:
            Notification.objects.create(
                user=user,
                message="Your password was changed successfully."
            )
        except Exception as notify_error:
            logger.warning(f"Could not create notification: {notify_error}")

        return Response({"message": "Password updated successfully."})
    
class TotalUserView(APIView):
    permission_classes = [IsAdmin]    
    
    def get(self, request):
        total_users = User.objects.count()
        return Response({
            "total_users": total_users
        }, status=status.HTTP_200_OK)    
        
        
        
class UpdateProfileView(generics.UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]  # For file uploads

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        user = self.get_object()
        serializer = self.get_serializer(user, data=request.data, partial=True)
        
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        try:
            self.perform_update(serializer)
            
            # 🟢 Notification: Profile updated
            try:
                Notification.objects.create(
                    user=user,
                    message="Your profile was updated successfully."
                )
            except Exception as notify_error:
                logger.warning(f"Could not create notification: {notify_error}")

            return Response({
                "message": "Profile updated successfully",
                "data": serializer.data
            }, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error(f"Profile update failed: {str(e)}")
            return Response(
                {"error": "An error occurred while updating profile"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
            
class DeleteAccountView(APIView):
    permission_classes = [IsActiveOrDeleting]

    def delete(self, request):
        user = request.user
        password = request.data.get("password")  # Require password confirmation

        if not password:
            return Response(
                {"error": "Password is required for account deletion"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not user.check_password(password):
            return Response(
                {"error": "Incorrect password"},
                status=status.HTTP_401_UNAUTHORIZED
            )

        try:
            # 🟢 Notification: Account deletion (sent before actual deletion)
            try:
                Notification.objects.create(
                    user=user,
                    message="Your account has been deleted. We're sorry to see you go."
                )
            except Exception as notify_error:
                logger.warning(f"Could not create deletion notification: {notify_error}")

            # Logout all sessions
            RefreshToken.for_user(user).blacklist()
            
            # Soft delete (recommended)
            user.is_active = False
            user.deleted_at = now()
            user.save()

            # Alternative: Hard delete
            # user.delete()

            return Response(
                {"message": "Account deleted successfully"},
                status=status.HTTP_204_NO_CONTENT
            )

        except Exception as e:
            logger.error(f"Account deletion failed: {str(e)}")
            return Response(
                {"error": "Account deletion failed"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
            
            
class UpdateAccountView(generics.UpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        user = self.get_object()
        email_changed = 'email' in request.data and request.data['email'] != user.email
        password = request.data.get('current_password')

        # If email is being changed, require password confirmation
        if email_changed and not password:
            return Response(
                {"error": "Current password is required to change email"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if email_changed and not user.check_password(password):
            return Response(
                {"error": "Incorrect password"},
                status=status.HTTP_401_UNAUTHORIZED
            )

        serializer = self.get_serializer(user, data=request.data, partial=True)
        
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        try:
            self.perform_update(serializer)
            updated_fields = list(request.data.keys())
            
            # 🟢 Notification: Account updated
            try:
                message = f"Your account was updated. Changed fields: {', '.join(updated_fields)}"
                Notification.objects.create(
                    user=user,
                    message=message
                )
                
                # Additional email notification for sensitive changes
                if email_changed:
                    send_mail(
                        "Email Address Changed",
                        "Your account email was updated successfully",
                        settings.DEFAULT_FROM_EMAIL,
                        [user.email]
                    )
            except Exception as notify_error:
                logger.warning(f"Notification failed: {notify_error}")

            return Response({
                "message": "Account updated successfully",
                "data": serializer.data
            })

        except Exception as e:
            logger.error(f"Account update failed: {str(e)}")
            return Response(
                {"error": "Account update failed"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )