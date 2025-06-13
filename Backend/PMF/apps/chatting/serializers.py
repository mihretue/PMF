from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Conversation, Message

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email'] # Adjust fields as needed

class MessageSerializer(serializers.Serializer):
    sender = UserSerializer(read_only=True)
    content = serializers.CharField()
    timestamp = serializers.DateTimeField(read_only=True)
    read = serializers.BooleanField(read_only=True)
    message_id = serializers.IntegerField(source='id', read_only=True) # Expose model's ID

class ConversationSerializer(serializers.ModelSerializer):
    user1 = UserSerializer(read_only=True)
    user2 = UserSerializer(read_only=True)
    last_message = serializers.SerializerMethodField()
    # Add messages here if you want to embed them, but for history, a separate endpoint is better

    class Meta:
        model = Conversation
        fields = ['id', 'user1', 'user2', 'created_at', 'last_message']

    def get_last_message(self, obj):
        last_msg = obj.messages.order_by('-timestamp').first()
        if last_msg:
            return MessageSerializer(last_msg).data
        return None

class CreateConversationSerializer(serializers.Serializer):
    target_user_id = serializers.IntegerField() # The ID of the user to start a conversation with