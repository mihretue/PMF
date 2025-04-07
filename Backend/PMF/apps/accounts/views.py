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
import logging
User = get_user_model()

logger = logging.getLogger(__name__)

# Registration view to create a user
# class RegisterView(generics.CreateAPIView):
#     queryset = User.objects.all()
#     serializer_class = RegisterSerializer
#     permission_classes = [permissions.AllowAny]

#     def create(self, request, *args, **kwargs):
#         response = super().create(request, *args, **kwargs)
#         # Fetch the user object using the email provided in the request
#         user = User.objects.get(email=request.data["email"])

#         # Create JWT tokens (access and refresh)
#         refresh = RefreshToken.for_user(user)

#         # You can return both the access and refresh tokens
#         return Response({
#             "access_token": str(refresh.access_token),
#             "refresh_token": str(refresh),
#         }, status=status.HTTP_201_CREATED)
 
 
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
                })
            return Response({"error": "Invalid credentials"}, status=400)

        return Response({"error": "Authentication type not recognized"}, status=400)

class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        request.user.auth_token.delete()
        return Response({"message": "Logged Out Successfully"})



# User profile view that retrieves user information for authenticated users
class UserProfileView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user



def generate_otp():
    return str(random.randint(100000,999999))

# class GenerateOTPView(APIView):
#     permission_classes = [permissions.AllowAny]
    
#     def post(self, request):
#         phone_number = request.data.get("phone_number")
#         user = User.objects.filter(phone_number=phone_number).first()
       
#         if not user:
#             return Response({"error": "User not found"}, status=400)
        
#         existing_otp = OTP.objects.filter(user=user, is_used=False, expires_at__gt=now()).first()
#         if existing_otp:
#             return Response({"error": "An OTP has already been sent. Please wait before requesting another."}, status=status.HTTP_429_TOO_MANY_REQUESTS)

#         otp = generate_otp()
#         hashed_otp = hashlib.sha256(otp.encode()).hexdigest()
#         OTP.objects.create(user=user, code=hashed_otp, expires_at=now() + timedelta(minutes=5))
#         # client = Client(settings.TWILIO_ACCOUNT_SID,settings.TWILIO_AUTH_TOKEN)
#         cache.set(phone_number, otp, timeout=300)
#         url = settings.SMS_URL
#         # Send OTP via email
#         # message = client.messages.create(
#         #     body=f"Your OTP is {otp}. It expires in 5 minutes.",
#         #     from_ = settings.TWILIO_PHONE_NUMBER,
#         #     to= user.phone_number,
            
#         # )
#         sms_params = {
#             "accessToken": settings.SMS_MODE_API_KEY,
#             "message": f"Your OTP is {otp}, It expires in 5 minutes",
#             "numero":user.phone_number,
#             "sender": "PMF",
#         }
#         response = requests.post(url, data=sms_params)
#         # if message.sid:
#         #     return Response({"message": "OTP sent successfully"}, status=status.HTTP_200_OK)
#         # else:
#         #     return Response({"error": "Failed to send OTP"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
#         if response.status_code == 200:
#             return Response({"message": "OTP sent successfully"})
#         else:
#             return Response({"error": "Failed to send OTP"}, status=500)    

# sending otp through email


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

        # Check if an unexpired OTP already exists
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

        # Generate and hash OTP
        otp = generate_otp()
        hashed_otp = hashlib.sha256(otp.encode()).hexdigest()

        # Save OTP
        OTP.objects.create(user=user, code=hashed_otp, expires_at=now() + timedelta(minutes=5))

        # Create message
        message = f"Your OTP is {otp}. It expires in 5 minutes."

        # Try sending the email
        try:
            send_mail(
                subject,
                message,
                from_email=None,  # Uses DEFAULT_FROM_EMAIL
                recipient_list=[email],
                fail_silently=False,
            )
            return Response({'message': 'OTP sent successfully via email'}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# class VerifyOTPView(APIView):
#     def post(self, request):
#         phone_number = request.data.get("phone_number")
#         otp_input = request.data.get("otp")

#         user = User.objects.filter(phone_number=phone_number).first()
#         if not user:
#             return Response({"error": "User not found"}, status=status.HTTP_400_BAD_REQUEST)

#         # Get the latest unused OTP
#         otp_instance = OTP.objects.filter(user=user, is_used=False, expires_at__gt=now()).order_by("-created_at").first()
        
#         if not otp_instance:
#             return Response({"error": "No OTP found or it has expired."}, status=status.HTTP_400_BAD_REQUEST)

#         # Verify OTP (hashed comparison)
#         if otp_instance.code != hashlib.sha256(otp_input.encode()).hexdigest():
#             return Response({"error": "Invalid OTP"}, status=status.HTTP_400_BAD_REQUEST)

#         # Mark OTP as used
#         otp_instance.is_used = True
#         otp_instance.save()

#         # Mark user as verified
#         user.is_verified = True
#         user.save()

#         # Remove OTP from cache
#         cache.delete(phone_number)

#         return Response({"message": "OTP verified successfully!"}, status=status.HTTP_200_OK)
    
    

class VerifyOTPView(APIView):
    def post(self, request):
        email = request.data.get("email")
        otp_input =  request.data.get("otp")
        
        
        user = User.objects.filter(email= email).first()
        if not user:
            return Response({"error": "User not found"}, status=status.HTTP_400_BAD_REQUEST)

        # Get the latest unused OTP
        otp_instance = OTP.objects.filter(user=user, is_used=False, expires_at__gt=now()).order_by("-created_at").first()
        
        if not otp_instance:
            return Response({"error": "No OTP found or it has expired."}, status=status.HTTP_400_BAD_REQUEST)

        # Verify OTP (hashed comparison)
        if otp_instance.code != hashlib.sha256(otp_input.encode()).hexdigest():
            return Response({"error": "Invalid OTP"}, status=status.HTTP_400_BAD_REQUEST)

        # Mark OTP as used
        otp_instance.is_used = True
        otp_instance.save()

        # Mark user as verified
        user.is_verified = True
        user.save()

        # Remove OTP from cache
        cache.delete(email)

        return Response({"message": "OTP verified successfully!"}, status=status.HTTP_200_OK)
   