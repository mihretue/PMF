from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model
from asgiref.sync import async_to_sync
import aioredis
from django.db.models import Q
from .models import MoneyTransfer, ForeignCurrencyRequest
from apps.Notifications import Notification
import logging

logger = logging.getLogger(__name__)

User = get_user_model()

# Async function to retrieve chat sessions
async def get_chat_sessions(user_id):
    redis = await aioredis.from_url(
        "rediss://default:AalJAAIjcDFiY2VkNGM0ZTA3MzQ0M2U5OGE0NzA3YWQ4NThiZDIxMXAxMA@learning-lizard-43337.upstash.io:6379",
        decode_responses=True
    )
    keys = await redis.keys(f"chat_session:{user_id}:*")
    sessions = []
    for key in keys:
        session = await redis.hgetall(key)
        recipient_id = session['recipient_id']
        recipient = User.objects.get(id=recipient_id)
        sessions.append({
            "recipient_id": recipient_id,
            "recipient_name": recipient.full_name,
            "profile_picture": recipient.profile_picture.url if recipient.profile_picture else None,
            "status": session['status']
        })
    await redis.close()
    return sessions

# Async function to store chat session in Redis
async def store_chat_session(sender_id, recipient_id):
    redis = await aioredis.from_url(
        "rediss://default:AalJAAIjcDFiY2VkNGM0ZTA3MzQ0M2U5OGE0NzA3YWQ4NThiZDIxMXAxMA@learning-lizard-43337.upstash.io:6379",
        decode_responses=True
    )
    session_key = f"chat_session:{sender_id}:{recipient_id}"
    await redis.hset(session_key, mapping={
        "sender_id": sender_id,
        "recipient_id": recipient_id,
        "status": "active"
    })
    await redis.close()

# Initiate Chat Session
class InitiateChatView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        sender = request.user
        recipient_id = request.data.get('recipient_id')

        # Validate recipient
        try:
            recipient = User.objects.get(id=recipient_id)
        except User.DoesNotExist:
            return Response({"error": "Recipient does not exist."}, status=400)

        # Ensure the recipient is a PMF user and can chat
        if not recipient.is_pmf_user or not getattr(recipient, 'can_chat', False):
            return Response(
                {"error": "The recipient is not a valid PMF user or cannot chat."},
                status=403
            )

        # Store chat session in Redis
        async_to_sync(store_chat_session)(sender.id, recipient.id)

        # Notify recipient about the new chat session
        try:
            Notification.objects.create(
                user=recipient,
                message=f"{sender.full_name} has initiated a chat with you."
            )
        except Exception as notify_error:
            logger.warning(f"Could not create notification: {notify_error}")

        return Response({
            "message": "Chat session initiated successfully.",
            "recipient": {
                "id": recipient.id,
                "full_name": recipient.full_name,
                "email": recipient.email,
                "profile_picture": recipient.profile_picture.url if recipient.profile_picture else None,
            }
        }, status=201)

# Retrieve active chat sessions for the authenticated user
class ChatSessionListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_id = request.user.id
        sessions = async_to_sync(get_chat_sessions)(user_id)
        return Response({"sessions": sessions})

# Search for recipients (with is_chat_initiated flag)
class RecipientSearchViewSet(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        query = request.query_params.get("name", "").strip()
        if not query:
            return Response({"detail": "Please provide a name query."}, status=400)

        results = []

        # Get the authenticated user's ID
        user_id = request.user.id

        # Search for PMF users
        pmf_users = User.objects.filter(
            Q(first_name__icontains=query) |
            Q(last_name__icontains=query) |
            Q(email__icontains=query),
            is_active=True
        )
        for user in pmf_users:
            # Check if a chat session exists in Redis
            async def check_chat_initiated(user_id, recipient_id):
                redis = await aioredis.from_url(
                    "rediss://default:AalJAAIjcDFiY2VkNGM0ZTA3MzQ0M2U5OGE0NzA3YWQ4NThiZDIxMXAxMA@learning-lizard-43337.upstash.io:6379",
                    decode_responses=True
                )
                session_key = f"chat_session:{user_id}:{recipient_id}"
                session_exists = await redis.exists(session_key)
                await redis.close()
                return session_exists

            is_chat_initiated = async_to_sync(check_chat_initiated)(user_id, user.id)

            results.append({
                "type": "pmf_user",
                "full_name": f"{user.first_name} {user.last_name}",
                "email": user.email,
                "profile_picture": user.profile_picture.url if user.profile_picture else None,
                "can_chat": True,
                "is_pmf_user": True,
                "id": user.id,
                "is_chat_initiated": is_chat_initiated  # Add the flag
            })

        # Search for MoneyTransfer recipients
        money_transfers = MoneyTransfer.objects.filter(recipient_name__icontains=query)
        for mt in money_transfers:
            results.append({
                "type": "money_transfer_recipient",
                "id": mt.id,
                "recipient_name": mt.recipient_name,
                "can_chat": False,
                "is_pmf_user": False,
                "status": mt.status,
                "amount": str(mt.amount),
                "currency_type": mt.currency_type,
                "created_at": mt.created_at.isoformat(),
                "is_chat_initiated": False  # Add the flag
            })

        # Search for ForeignCurrencyRequest recipients
        foreign_requests = ForeignCurrencyRequest.objects.filter(recipient_full_name__icontains=query)
        for fr in foreign_requests:
            results.append({
                "type": "foreign_currency_recipient",
                "id": fr.id,
                "recipient_name": fr.recipient_full_name,
                "can_chat": False,
                "is_pmf_user": False,
                "status": fr.status,
                "amount": str(fr.amount),
                "currency_type": fr.currency_type,
                "created_at": fr.created_at.isoformat(),
                "is_chat_initiated": False  # Add the flag
            })

        return Response({"results": results})
