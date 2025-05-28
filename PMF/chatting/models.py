from django.db import models
from django.conf import settings 
class Conversation(models.Model):
    user1 = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='conversations_initiated'
    )
    user2 = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='conversations_received'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user1', 'user2') # Ensure only one conversation between two users
        # Add an index to improve lookup speed for user1 and user2
        indexes = [
            models.Index(fields=['user1', 'user2']),
            models.Index(fields=['user2', 'user1']), # Also for the reverse order
        ]

    def __str__(self):
        return f"Conversation between {self.user1.username} and {self.user2.username}"

    def get_other_user(self, current_user):
        """Helper to get the other participant in a conversation."""
        if current_user == self.user1:
            return self.user2
        elif current_user == self.user2:
            return self.user1
        return None # Should not happen if current_user is part of the conversation

class Message(models.Model):
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='sent_messages')
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    read = models.BooleanField(default=False) # Optional: for read receipts

    class Meta:
        ordering = ['timestamp']

    def __str__(self):
        return f"Message from {self.sender.username} in {self.conversation}"