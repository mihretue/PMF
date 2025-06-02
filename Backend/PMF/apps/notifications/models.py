from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Notification(models.Model):
    NOTIFICATION_TYPES = [
        ("registration", "User Registration"),
        ("money_transfer_initiated", "Money Transfer Initiated"),
        ("money_transfer_completed", "Money Transfer Completed"),
        ("currency_request_update", "Foreign Currency Request Update"),
        ("exchange_rate_alert", "Exchange Rate Alert"),
        ("payment_received", "PaymentTransaction Received"),
        ("escrow_created", "Escrow Created"),
        ("settlement_processed", "Settlement Processed"),
        ("transaction_issue", "Transaction Issues or Failures"),
        ("escrow_flag_admin", "Admin Escrow Flags / Fraud Alerts"),
        ("fraud_event", "Fraud Detection Event"),

    ]

    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notifications")
    type = models.CharField(max_length=64, choices=NOTIFICATION_TYPES)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    # Optionally: link, metadata, etc.

    def __str__(self):
        return f"{self.get_type_display()} for {self.recipient}"