import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from django.contrib.auth import get_user_model # To get the correct user model

from .models import Conversation, Message

User = get_user_model() # Get the currently active user model

class PersonalChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Authenticate the user
        if not self.scope["user"].is_authenticated:
            await self.close()
            return

        # The 'conversation_id' should come from the URL routing
        # e.g., ws/chat/<int:conversation_id>/
        self.conversation_id = self.scope['url_route']['kwargs']['conversation_id']
        self.user = self.scope['user']

        # Verify the user is part of this conversation
        try:
            self.conversation = await sync_to_async(Conversation.objects.get)(id=self.conversation_id)
            if self.user not in [self.conversation.user1, self.conversation.user2]:
                await self.close(code=4003) # Unauthorized
                return
        except Conversation.DoesNotExist:
            await self.close(code=4004) # Conversation not found
            return

        # Create a unique group name for this conversation
        self.conversation_group_name = f'chat_{self.conversation_id}'

        # Add this consumer to the conversation's group
        await self.channel_layer.group_add(
            self.conversation_group_name,
            self.channel_name
        )

        await self.accept()

        # Optional: Load initial messages (e.g., last 20 messages)
        # This part might be better handled by a separate REST API endpoint
        # when the client first loads the chat, but can also be done here.
        # For simplicity, we'll assume the frontend fetches history via REST.

    async def disconnect(self, close_code):
        if self.conversation_group_name: # Ensure it was set
            await self.channel_layer.group_discard(
                self.conversation_group_name,
                self.channel_name
            )

    async def receive(self, text_data):
        if not self.scope["user"].is_authenticated:
            # Should ideally be caught by connect, but good to double check
            await self.close()
            return

        text_data_json = json.loads(text_data)
        message_content = text_data_json.get('message')

        if not message_content:
            return # Ignore empty messages

        # Save message to database
        new_message = await sync_to_async(Message.objects.create)(
            conversation=self.conversation,
            sender=self.user,
            content=message_content
        )

        # Send message to group (both participants in the conversation)
        await self.channel_layer.group_send(
            self.conversation_group_name,
            {
                'type': 'chat_message',
                'message': new_message.content,
                'sender_id': self.user.id,
                'sender_username': self.user.username,
                'timestamp': new_message.timestamp.isoformat(), # Send ISO format for frontend
                'message_id': new_message.id,
            }
        )

    # Receive message from channel layer group
    async def chat_message(self, event):
        # Send message to WebSocket (the connected client)
        await self.send(text_data=json.dumps({
            'type': 'chat_message', # Add type for frontend parsing
            'message': event['message'],
            'sender_id': event['sender_id'],
            'sender_username': event['sender_username'],
            'timestamp': event['timestamp'],
            'message_id': event['message_id'],
        }))

    # Optional: Implement read receipts
    async def mark_as_read(self, text_data):
        # This would be triggered by a specific 'type' in the received JSON
        text_data_json = json.loads(text_data)
        message_id = text_data_json.get('message_id')
        if message_id:
            try:
                # Mark message as read by the current user
                message = await sync_to_async(Message.objects.get)(id=message_id, conversation=self.conversation)
                if message.sender != self.user: # Only mark messages sent by the other party as read
                    message.read = True
                    await sync_to_async(message.save)()
                    # Optionally, send a 'read_receipt' event to the sender
                    await self.channel_layer.group_send(
                        self.conversation_group_name,
                        {
                            'type': 'read_receipt',
                            'message_id': message_id,
                            'reader_id': self.user.id,
                        }
                    )
            except Message.DoesNotExist:
                pass