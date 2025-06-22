from django.db import models
from django.contrib.auth import get_user_model
from cloudinary.models import CloudinaryField

User = get_user_model()

class KYC(models.Model):
    DOCUMENT_TYPES = [
        ('passport', 'Passport'),
        ('national_id', 'National ID'),
        ('driver_license', 'Driver License'),
        ('BRP', 'BRP'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    date_of_birth = models.DateField()
    document_type = models.CharField(max_length=20, choices=DOCUMENT_TYPES)
    document_front = CloudinaryField('document_front', folder='kyc_documents/')
    document_back = CloudinaryField('document_back', folder='kyc_documents/', null=True, blank=True)
    verification_status = models.CharField(
        max_length=20,
        choices=[('pending', 'Pending'), ('approved', 'Approved'), ('rejected', 'Rejected')],
        default='pending'
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"KYC for {self.user.email} - {self.document_type}"
