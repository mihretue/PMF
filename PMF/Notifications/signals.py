# Example: Trigger notification on user registration using Django signals
from django.dispatch import receiver
from django.db.models.signals import post_save
from django.contrib.auth import get_user_model
from .services import send_notification

User = get_user_model()

@receiver(post_save, sender=User)
def notify_user_registration(sender, instance, created, **kwargs):
    if created:
        send_notification(
            recipient=instance,
            type="registration",
            message="Welcome! Your account has been created.",
            send_email=True,
            email_subject="Welcome to PMF",
        )