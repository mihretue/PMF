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
from .services import fetch_and_save_daily_rates
from django.utils.timezone import now
import logging

logger = logging.getLogger(__name__)

@receiver(post_save, sender=MoneyTransfer)
@receiver(post_save, sender=ForeignCurrencyRequest)
def create_daily_exchange_rate_on_transaction(sender, instance, created, **kwargs):
    if created:
        today = now().date()
        exists = DailyExchangeRate.objects.filter(date=today).exists()
        if not exists:
            try:
                obj, created = fetch_and_save_daily_rates()
                if created:
                    logger.info(f"Daily exchange rates for {obj.date} created via transaction signal.")
            except Exception as e:
                logger.error(f"Failed to fetch and save exchange rates: {str(e)}")
