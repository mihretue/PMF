<<<<<<< HEAD
# PMF/asgi.py
=======
<<<<<<< HEAD:PMF/PMF/asgi.py
# PMF/asgi.py
=======
"""
ASGI config for PMF project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/asgi/
"""
>>>>>>> 580101a1e76761a0e66563686e61305b8dbec3af:Backend/PMF/PMF/asgi.py
>>>>>>> 1060cc4c7d21d84ed819cb12df9ca34011d875e3

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

import chatting.routing


application = ProtocolTypeRouter({
    "http": get_asgi_application(), # get_asgi_application() is now defined because it's imported above
    "websocket": TokenAuthMiddlewareStack(
        URLRouter(
            chatting.routing.websocket_urlpatterns
        )
    ),
})