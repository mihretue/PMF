from django.urls import path
from .views import ConversationListCreateAPIView, ConversationDetailAPIView, MessageListAPIView

urlpatterns = [
    path('conversations/', ConversationListCreateAPIView.as_view(), name='conversation-list-create'),
    path('conversations/<int:id>/', ConversationDetailAPIView.as_view(), name='conversation-detail'),
    path('conversations/<int:conversation_id>/messages/', MessageListAPIView.as_view(), name='message-list'),
]