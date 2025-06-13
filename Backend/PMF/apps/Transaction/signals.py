from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings
from .models import Wallet
import uuid
# @receiver(post_save, sender=settings.AUTH_USER_MODEL)
# def create_wallet_for_new_user(sender, instance, created, **kwargs):
#     if created:
#         Wallet.objects.create(owner=instance)




@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_wallet_for_new_user(sender, instance, created, **kwargs):
    if created:
        Wallet.objects.create(
            owner=instance,
            account_number=f"WALLET-{uuid.uuid4().hex[:8]}"  # or any unique pattern you prefer

        )