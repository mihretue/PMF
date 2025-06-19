# You can safely remove this file if you don't need ASGI/Channels support.
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'PMF.settings')
django.setup()

from django.core.asgi import get_asgi_application

application = get_asgi_application()
