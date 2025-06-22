from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import KYC
from django.contrib.auth import get_user_model

User = get_user_model()

@receiver(post_save, sender=KYC)
def update_user_kyc_status(sender, instance, **kwargs):
    user = instance.user
    if instance.verification_status == "approved" and not user.is_kyc_verified:
        user.is_kyc_verified = True
        user.save()
    elif instance.verification_status != "approved" and user.is_kyc_verified:
        user.is_kyc_verified = False
        user.save()
