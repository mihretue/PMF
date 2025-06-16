from django.apps import AppConfig


class EscrowConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.Escrow'
    
    def ready(self):
        import apps.Escrow.signals
