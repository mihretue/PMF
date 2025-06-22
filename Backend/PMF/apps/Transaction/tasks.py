from celery import shared_task
from .utils import fetch_exchange_rates
from .models import ExchangeRate, CurrencyAlert
from django.utils.timezone import now
from celery import shared_task
from django.utils.timezone import now
from .models import CurrencyAlert
from apps.Notifications.models import Notification
from .services import get_live_exchange_rate
from django.core.mail import send_mail


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


@shared_task
def check_currency_alerts():
    alerts = CurrencyAlert.objects.filter(is_active=True)
    for alert in alerts:
        rate = get_live_exchange_rate(alert.base_currency, alert.target_currency)
        if rate:
            should_notify = False
            if alert.notified_at is None:
                should_notify = True
            elif (now() - alert.notified_at) >= alert.notify_interval:
                should_notify = True

            if alert.min_rate <= rate <= alert.max_rate and should_notify:
                send_mail(
                    'Currency Alert Triggered!',
                    f'The {alert.base_currency}/{alert.target_currency} rate is now {rate}, within your set range of {alert.min_rate}-{alert.max_rate}.',
                    'from@example.com',
                    [alert.user.email],
                    fail_silently=False,
                )
                alert.notified_at = now()
                alert.save()




@shared_task
def check_currency_alerts():
    alerts = CurrencyAlert.objects.filter(is_active=True)
    for alert in alerts:
        rate = get_live_exchange_rate(alert.base_currency, alert.target_currency)
        if rate:
            should_notify = False
            if alert.notified_at is None:
                should_notify = True
            elif (now() - alert.notified_at) >= alert.notify_interval:
                should_notify = True

            if alert.min_rate <= rate <= alert.max_rate and should_notify:
                # In-app notification for the user!
                Notification.objects.create(
                    user=alert.user,
                    message=(f"Currency alert: {alert.base_currency}/{alert.target_currency} "
                             f"rate is {rate:.4f}, within your set range ({alert.min_rate}-{alert.max_rate})")
                )
                alert.notified_at = now()
                alert.save()