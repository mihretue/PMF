from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings
from .models import Wallet
import uuid
# @receiver(post_save, sender=settings.AUTH_USER_MODEL)
# def create_wallet_for_new_user(sender, instance, created, **kwargs):
#     if created:
#         Wallet.objects.create(owner=instance)




@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_wallet_for_new_user(sender, instance, created, **kwargs):
    if created:
        Wallet.objects.create(
            owner=instance,
            account_number=f"WALLET-{uuid.uuid4().hex[:8]}"  # or any unique pattern you prefer

        )
        
        
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import MoneyTransfer, ForeignCurrencyRequest, DailyExchangeRate
from django.utils.timezone import now

@receiver(post_save, sender=MoneyTransfer)
@receiver(post_save, sender=ForeignCurrencyRequest)
def update_daily_exchange_rate_on_transaction(sender, instance, created, **kwargs):
    if not created:
        return  # Only run on new transactions

    today = now().date()

    # For MoneyTransfer, use currency_type; for ForeignCurrencyRequest, currency_type as well
    base_currency = "USD"  # assuming ETB is base; adjust if needed

    daily_rate, created = DailyExchangeRate.objects.get_or_create(date=today, base_code=base_currency)

    rates = daily_rate.rates or {}

    # Add or update exchange rate for the transaction's currency
    currency = instance.currency_type

    # Assume you have a way to get the current exchange rate (e.g., a helper function)
    from .services import get_live_exchange_rate

    rate = get_live_exchange_rate(base_currency, currency)

    if rate is not None:
        rates[currency] = float(rate)
        daily_rate.rates = rates
        daily_rate.save()
