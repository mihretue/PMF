from django.apps import AppConfig


class UserVerificationsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.KYC'
    
    def ready(self):
        import apps.KYC.signals  # 👈 make sure signals are loaded
