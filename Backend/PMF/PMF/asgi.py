

import os
import django

# 1. Set the Django settings module environment variable FIRST
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'PMF.settings')

# 2. Initialize Django's app registry IMMEDIATELY AFTER setting the module
django.setup()

# 3. NOW, you can safely import anything that depends on Django apps and models
#    This includes get_asgi_application() which needs the app registry to be ready.
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from PMF.middleware import TokenAuthMiddlewareStack

import apps.chatting.routing


application = ProtocolTypeRouter({
    "http": get_asgi_application(), # get_asgi_application() is now defined because it's imported above
    "websocket": TokenAuthMiddlewareStack(
        URLRouter(
            apps.chatting.routing.websocket_urlpatterns
        )
    ),
})