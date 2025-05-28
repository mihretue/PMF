from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from django.contrib.auth import get_user_model

from .models import Conversation, Message
from .serializers import ConversationSerializer, MessageSerializer, CreateConversationSerializer

User = get_user_model()

class ConversationListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = ConversationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Get conversations where the current user is either user1 or user2
        return Conversation.objects.filter(
            Q(user1=self.request.user) | Q(user2=self.request.user)
        ).order_by('-created_at')

    def create(self, request, *args, **kwargs):
        serializer = CreateConversationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        target_user_id = serializer.validated_data['target_user_id']

        try:
            target_user = User.objects.get(id=target_user_id)
        except User.DoesNotExist:
            return Response(
                {"detail": "Target user not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        if target_user == request.user:
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
            # Return existing conversation
            serializer = self.get_serializer(conversation)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            # Create new conversation
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