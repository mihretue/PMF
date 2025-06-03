from django.conf import settings
from django.core.mail import send_mail
from .models import Notification

def send_notification(recipient, type, message, send_email=False, email_subject=None):
    # Create Notification object
    notif = Notification.objects.create(
        recipient=recipient,
        type=type,
        message=message,
    )
    # Optionally send email
    if send_email and recipient.email:
        send_mail(
            email_subject or "Notification",
            message,
            settings.DEFAULT_FROM_EMAIL,
            [recipient.email],
            fail_silently=True,
        )
    return notif