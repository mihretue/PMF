from celery import shared_task
from .utils import fetch_exchange_rates
from .models import ExchangeRate
from django.utils.timezone import now

@shared_task
def update_exchange_rates_task():
    """Celery task to fetch and update exchange rates."""
    rates = fetch_exchange_rates()  # Fetch rates from API

    if not rates:
        return "Failed to Fetch Exchange Rates"

    for currency, rate in rates.items():
        ExchangeRate.objects.update_or_create(
            currency_from="USD",
            currency_to=currency,
            defaults={"rate": rate, "last_updated": now()}
        )

    return "Exchange Rates Updated Successfully"
