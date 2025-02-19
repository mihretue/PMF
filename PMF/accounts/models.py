from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models


class CustomUserManager(BaseUserManager):
    def create_user(self, email, phone_number, password=None, **extra_fields):
        if not email:
            raise ValueError("Email is required")
        if not phone_number:
            raise ValueError("Phone number is required")

        email = self.normalize_email(email)
        user = self.model(email=email, phone_number=phone_number, **extra_fields)
        user.set_password(password)  # Securely set password
        user.save(using=self._db)
        return user

    def create_superuser(self, email, phone_number, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(email, phone_number, password, **extra_fields)


class User(AbstractUser):
    USER_TYPES = [
        ("sender", "Sender"),
        ("receiver", "Receiver"),
        ("admin", "Admin"),
    ]

    full_name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=50, unique=True)
    user_type = models.CharField(max_length=10, choices=USER_TYPES)
    country = models.CharField(max_length=100, null=True, blank=True)
    verification_status = models.CharField(
        max_length=10,
        choices=[
            ("pending", "Pending"),
            ("verified", "Verified"),
            ("rejected", "Rejected"),
        ],
        default="pending",
    )
    government_id = models.TextField(null=True, blank=True)
    proof_of_address = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # Avoid conflicts with Django's built-in auth models
    groups = models.ManyToManyField(
        "auth.Group",
        related_name="custom_user_groups",
        blank=True,
    )
    user_permissions = models.ManyToManyField(
        "auth.Permission",
        related_name="custom_user_permissions",
        blank=True,
    )
    username = models.CharField(max_length=255, blank=True, null=True)
    USERNAME_FIELD = "email"  # Use email for authentication
    REQUIRED_FIELDS = ["phone_number", "full_name"]  # Required when creating a user

    objects = CustomUserManager()

    def __str__(self):
        return self.full_name
