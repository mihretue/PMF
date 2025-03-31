from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from .models import OTP
from django.utils.timezone import now
from datetime import timedelta

User = get_user_model()

class UserAuthTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.register_url = "api/user/register/"
        self.login_url = "api/user/login/"
        self.logout_url = "api/user/logout/"
        self.generate_otp_url = "api/user/generate-otp/"
        self.verify_otp_url = "api/user/verify-otp/"

        self.user_data = {
            "email": "mihretuendeshaw84@gmail.com",
            "phone_number": "+251963319727",
            "password": "testpassword123",
            "first_name": "Test",
            "last_name": "User",
            "address": "123 Test Street",
        }

        self.user = User.objects.create_user(
            email=self.user_data["email"],
            phone_number=self.user_data["phone_number"],
            password=self.user_data["password"],
            first_name=self.user_data["first_name"],
            last_name=self.user_data["last_name"],
            address=self.user_data["address"],
        )

    def test_registration(self):
        """Test user registration"""
        response = self.client.post(self.register_url, self.user_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_login(self):
        """Test user login"""
        response = self.client.post(self.login_url, {
            "email": self.user_data["email"],
            "password": self.user_data["password"]
        }, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("token", response.data)

    def test_logout(self):
        """Test user logout"""
        login_response = self.client.post(self.login_url, {
            "email": self.user_data["email"],
            "password": self.user_data["password"]
        }, format="json")
        token = login_response.data.get("token")
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {token}")

        response = self.client.post(self.logout_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_generate_otp(self):
        """Test OTP generation"""
        response = self.client.post(self.generate_otp_url, {
            "phone_number": self.user.phone_number
        }, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        otp = OTP.objects.filter(user=self.user).first()
        self.assertIsNotNone(otp)

    def test_verify_otp(self):
        """Test OTP verification"""
        otp_code = "123456"
        OTP.objects.create(
            user=self.user,
            code=otp_code,
            expires_at=now() + timedelta(minutes=5)
        )

        response = self.client.post(self.verify_otp_url, {
            "otp": otp_code
        }, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["message"], "OTP verified successfully!")

    def test_invalid_otp(self):
        """Test invalid OTP verification"""
        response = self.client.post(self.verify_otp_url, {
            "otp": "999999"
        }, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["error"], "Invalid OTP")
