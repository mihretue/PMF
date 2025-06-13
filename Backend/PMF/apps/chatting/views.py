from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from django.contrib.auth import get_user_model
from rest_framework import permissions

from .models import Conversation, Message
from .serializers import ConversationSerializer, MessageSerializer, CreateConversationSerializer

User = get_user_model()


class ConversationListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = ConversationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # self.request.user will be your authenticated accounts.User instance
        # Added a print here too for completeness
        print(f"DEBUG get_queryset: Current user: {self.request.user} (ID: {self.request.user.id})")
        return Conversation.objects.filter(
            Q(user1=self.request.user) | Q(user2=self.request.user)
        ).order_by('-created_at')

    def create(self, request, *args, **kwargs):
        print(f"DEBUG create: Authenticated user (request.user): {request.user} (ID: {request.user.id}, is_active: {request.user.is_active}, is_staff: {request.user.is_staff})") # NEW PRINT

        serializer = CreateConversationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        target_user_id = serializer.validated_data['target_user_id']
        print(f"DEBUG create: Target user ID from request body: {target_user_id}") # NEW PRINT

        try:
            target_user = User.objects.get(id=target_user_id)
            print(f"DEBUG create: Target user found: {target_user} (ID: {target_user.id})") # NEW PRINT
        except User.DoesNotExist:
            print(f"DEBUG create: Target user with ID {target_user_id} not found (returning 404).") # NEW PRINT
            return Response(
                {"detail": "Target user not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        if target_user == request.user:
            print("DEBUG create: Attempting to create conversation with self (returning 400).") # NEW PRINT
            return Response(
                {"detail": "Cannot create conversation with yourself."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check if a conversation already exists (order-agnostic)
        conversation = Conversation.objects.filter(
            (Q(user1=request.user) & Q(user2=target_user)) |
            (Q(user1=target_user) & Q(user2=request.user))
        ).first()

        if conversation:
            print(f"DEBUG create: Existing conversation found: {conversation.id} (returning 200).") # NEW PRINT
            serializer = self.get_serializer(conversation)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            print(f"DEBUG create: Creating new conversation between user {request.user.id} and user {target_user.id} (returning 201).") # NEW PRINT
            conversation = Conversation.objects.create(user1=request.user, user2=target_user)
            serializer = self.get_serializer(conversation)
            return Response(serializer.data, status=status.HTTP_201_CREATED)


class ConversationDetailAPIView(generics.RetrieveAPIView):
    serializer_class = ConversationSerializer
    permission_classes = [IsAuthenticated]
    queryset = Conversation.objects.all() # Or use get_queryset
    lookup_field = 'id' # Ensure it matches your URL conf

    def get_queryset(self):
        # Only allow access to conversations the user is part of
        return Conversation.objects.filter(
            Q(user1=self.request.user) | Q(user2=self.request.user)
        )

class MessageListAPIView(generics.ListAPIView):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        conversation_id = self.kwargs['conversation_id']
        # Ensure the current user is part of the conversation
        conversation = generics.get_object_or_404(
            Conversation.objects.filter(
                Q(user1=self.request.user) | Q(user2=self.request.user)
            ), id=conversation_id
        )
        return Message.objects.filter(conversation=conversation).order_by('timestamp')