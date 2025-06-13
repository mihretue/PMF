from django.apps import AppConfig


class TransactionConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.Transaction'
    
    def ready(self):
        import apps.Transaction.signals  # Ensure signals are imported when the app is ready
