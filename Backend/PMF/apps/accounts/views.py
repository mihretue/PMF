from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.contrib.auth import get_user_model
from rest_framework.authtoken.models import Token
from .serializers import UserSerializer, RegisterSerializer
from oauth2_provider.models import AccessToken
import random
from django.core.mail import send_mail
from django.conf import settings
from datetime import timezone, timedelta
from django.utils.timezone import now
from .models import OTP,User
from twilio.rest import Client
import hashlib
import requests
from django.core.cache import cache
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
import logging
User = get_user_model()

logger = logging.getLogger(__name__)


 
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        # Log the incoming payload
        logger.debug(f"Received payload: {request.data}")

        try:
            # Call the parent create method, which handles serialization and validation
            response = super().create(request, *args, **kwargs)
            # Fetch the user object using the email provided in the request
            user = User.objects.get(email=request.data["email"])

            # Create JWT tokens (access and refresh)
            refresh = RefreshToken.for_user(user)

            # Log successful registration
            logger.info(f"User registered successfully: {user.email}")

            # Return tokens in the response
            return Response({
                "access_token": str(refresh.access_token),
                "refresh_token": str(refresh),
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            # Log the error and payload for debugging
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid()  # Run validation to get errors
            logger.error(f"Registration failed: {str(e)} | Validation errors: {serializer.errors} | Payload: {request.data}")
            # Re-raise the exception to let DRF handle the response
            raise       
# Login view supporting both JWT and OAuth2 Authentication
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
                return Response({"message": f"Welcome, {user.full_name}"})
            except AccessToken.DoesNotExist:
                return Response({"error": "Invalid OAuth2 token"}, status=400)

        # JWT Authentication
        elif auth_type == "JWT":
            user = User.objects.filter(email=email).first()
            if user and user.check_password(password):
                refresh = RefreshToken.for_user(user)
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

# User profile view that retrieves user information for authenticated users
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

        # ✅ Save plaintext, let model hash it
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

        # Get the latest unused, unexpired OTP
        otp_instance = OTP.objects.filter(user=user, is_used=False, expires_at__gt=now()).order_by("-created_at").first()
        if not otp_instance:
            return Response({"error": "No OTP found or it has expired."}, status=status.HTTP_400_BAD_REQUEST)

        # Use the model's verify method to check OTP
        if not otp_instance.verify_otp(otp_input):
            return Response({"error": "Invalid OTP"}, status=status.HTTP_400_BAD_REQUEST)

        # Mark OTP as used
        otp_instance.is_used = True
        otp_instance.save()

        # Mark user as verified
        user.is_verified = True
        user.save()

        # Remove OTP from cache if applicable
        cache.delete(email)

        return Response({"message": "OTP verified successfully!"}, status=status.HTTP_200_OK)



class ResendOTPView(APIView):
    def post(self, request):
        email = request.data.get("email")
        user = User.objects.filter(email=email).first()

        if not user:
            return Response({"error": "User not found"}, status=status.HTTP_400_BAD_REQUEST)

        # Check if the OTP is still valid
        otp_instance = OTP.objects.filter(user=user, is_used=False, expires_at__gt=now()).first()
        if otp_instance:
            return Response({"error": "An OTP has already been sent. Please wait before requesting another."}, status=status.HTTP_429_TOO_MANY_REQUESTS)

        # Generate and send a new OTP
        return GenerateOTPView.as_view()(request)
        # return Response({"message": "OTP resent successfully!"}, status=status.HTTP_200_OK)


class GetUserProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user  # DRF resolves this via the token
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)