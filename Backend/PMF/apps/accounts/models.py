from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models
from django.utils.timezone import now
import hashlib

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
        extra_fields.setdefault("role", "admin")  # Ensure superuser is an admin
        return self.create_user(email, phone_number, password, **extra_fields)


class User(AbstractUser):
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('sender', 'Sender'),  # Diaspora who sends money
        ('receiver', 'Receiver')  # Ethiopian who receives money
    ]
    
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=255, unique=True)
    address = models.CharField(max_length=255, blank=True, null=True)
    is_verified = models.BooleanField(default=False)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='receiver')  # Default is Receiver

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
    
    username = None
    USERNAME_FIELD = "email"  # Use email for authentication
    REQUIRED_FIELDS = ["phone_number"]  # Required when creating a user

    objects = CustomUserManager()

    def __str__(self):
        return f"{self.first_name} {self.last_name}" if self.first_name and self.last_name else self.email
    
    def is_admin(self):
        return self.role == 'admin'

    def is_sender(self):
        return self.role == 'sender'

    def is_receiver(self):
        return self.role == 'receiver'



class OTP(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    code = models.CharField(max_length=64)  # Storing SHA256 hash
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    is_used = models.BooleanField(default=False)

    def is_expired(self):
        return now() > self.expires_at

    def is_valid(self, otp_input):
        return not self.is_used and not self.is_expired() and self.verify_otp(otp_input)

    def hash_otp(self, otp):
        return hashlib.sha256(otp.encode()).hexdigest()

    def verify_otp(self, otp_input):
        return self.code == self.hash_otp(otp_input)

    def save(self, *args, **kwargs):
        # Hash only on first save (i.e., creation)
        if not self.pk:
            self.code = self.hash_otp(self.code)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"OTP for {self.user.email} (Expires at {self.expires_at})"
