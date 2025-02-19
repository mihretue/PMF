from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.contrib.auth import get_user_model
from rest_framework.authtoken.models import Token
from .serializers import UserSerializer, RegisterSerializer
from oauth2_provider.models import AccessToken

User = get_user_model()

# Registration view to create a user
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        # Fetch the user object using the email provided in the request
        user = User.objects.get(email=request.data["email"])

        # Create JWT tokens (access and refresh)
        refresh = RefreshToken.for_user(user)

        # You can return both the access and refresh tokens
        return Response({
            "access_token": str(refresh.access_token),
            "refresh_token": str(refresh),
        }, status=status.HTTP_201_CREATED)
        
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

# User profile view that retrieves user information for authenticated users
class UserProfileView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user
