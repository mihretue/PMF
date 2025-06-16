import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'PMF.settings')
django.setup()  # <- This must be called before importing models or anything using apps


from channels.routing import ProtocolTypeRouter, URLRouter
from apps.chatting.routing import websocket_urlpatterns
from django.core.asgi import get_asgi_application
from PMF.middleware import JwtAuthMiddleware 


application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": JwtAuthMiddleware(
        URLRouter(
            websocket_urlpatterns
        )
    ),
})
