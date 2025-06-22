# management/commands/fetch_daily_rates.py
from django.core.management.base import BaseCommand
from app.services import fetch_and_save_daily_rates

class Command(BaseCommand):
    help = 'Fetch and store daily exchange rates'

    def handle(self, *args, **kwargs):
        obj, created = fetch_and_save_daily_rates()
        if created:
            self.stdout.write(self.style.SUCCESS(f"✅ Created rates for {obj.date}"))
        else:
            self.stdout.write(self.style.WARNING(f"🔄 Updated rates for {obj.date}"))
