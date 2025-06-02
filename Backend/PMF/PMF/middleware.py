# This file will bridge your JWT authentication to Django Channels

import jwt
from django.conf import settings
from django.contrib.auth.models import AnonymousUser
from channels.db import database_sync_to_async
from urllib.parse import parse_qs
from django.contrib.auth import get_user_model
from channels.auth import AuthMiddlewareStack # This will be part of the final stack

# Get your custom User model from the 'accounts' app
User = get_user_model()

@database_sync_to_async
def get_user_from_token(token_key):
    """
    Decodes a JWT token and fetches the corresponding Django User object.
    Runs in an async context, but performs sync database operation.
    """
    try:
        # Verify and decode the token using your project's SECRET_KEY
        # Make sure algorithms matches what simplejwt uses (typically HS256)
        decoded_data = jwt.decode(token_key, settings.SECRET_KEY, algorithms=["HS256"])
        user_id = decoded_data.get('user_id') # SimpleJWT stores user_id in the token payload

        if user_id is None:
            return AnonymousUser()

        user = User.objects.get(id=user_id)
        return user
    except jwt.ExpiredSignatureError:
        print("DEBUG: Token expired")
        return AnonymousUser()
    except jwt.DecodeError:
        print("DEBUG: Token decode error")
        return AnonymousUser()
    except User.DoesNotExist:
        print("DEBUG: User in token does not exist")
        return AnonymousUser()
    except Exception as e:
        print(f"DEBUG: Unhandled error in get_user_from_token: {e}")
        return AnonymousUser()

class TokenAuthMiddleware:
    """
    Custom middleware to authenticate WebSocket connections using a JWT token
    provided in the 'token' query parameter.
    """
    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        # Parse the query string to get the token
        query_string = parse_qs(scope["query_string"].decode("utf8"))
        token = query_string.get("token")

        if token:
            # Get the first token if multiple are present
            scope["user"] = await get_user_from_token(token[0])
        else:
            scope["user"] = AnonymousUser() # No token, so an anonymous user

        return await self.app(scope, receive, send)

# Helper function to combine with AuthMiddlewareStack (for session auth fallback if needed)
def TokenAuthMiddlewareStack(inner):
    return TokenAuthMiddleware(AuthMiddlewareStack(inner))