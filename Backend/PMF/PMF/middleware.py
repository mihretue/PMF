from urllib.parse import parse_qs
from channels.middleware import BaseMiddleware
from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser
from rest_framework_simplejwt.tokens import UntypedToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from django.contrib.auth import get_user_model
import jwt
from django.conf import settings

User = get_user_model()

@database_sync_to_async
def get_user(user_id):
    try:
        return User.objects.get(id=user_id)
    except User.DoesNotExist:
        return AnonymousUser()

class JwtAuthMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        query_string = parse_qs(scope["query_string"].decode())
        token = None

        if "token" in query_string:
            token = query_string["token"][0]

        print(f"Token received: {token}")

        if token is None:
            print("No token found, assigning AnonymousUser")
            scope["user"] = AnonymousUser()
            return await super().__call__(scope, receive, send)

        try:
            UntypedToken(token)  # validates token
            decoded_data = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
            user = await get_user(decoded_data["user_id"])
            print(f"User authenticated: {user}")
            scope["user"] = user
        except (InvalidToken, TokenError, jwt.DecodeError) as e:
            print(f"Token validation failed: {e}")
            scope["user"] = AnonymousUser()

        return await super().__call__(scope, receive, send)
