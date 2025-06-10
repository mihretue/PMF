"""
ASGI config for PMF project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/asgi/
"""

import os
import django

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter

# Import your custom middleware and websocket routing
from PMF.middleware import TokenAuthMiddlewareStack
import apps.chatting.routing

# Set the Django settings module environment variable
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'PMF.settings')

# Initialize Django apps registry
django.setup()

# Define ASGI application
application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": TokenAuthMiddlewareStack(
        URLRouter(
            apps.chatting.routing.websocket_urlpatterns
        )
    ),
})
