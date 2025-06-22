import requests
from datetime import datetime

EXCHANGE_RATE_API_URL = "https://open.er-api.com/v6/latest/USD?apikey=e51230e41ec1f00c47836b73"

def get_live_exchange_rate(currency_from, currency_to):
    """
    Fetch exchange rate from external API.
    Returns None if rate not found.
    """
    response = requests.get(EXCHANGE_RATE_API_URL)
    if response.status_code != 200:
        return None
    
    data = response.json()
    rates = data.get("rates", {})
    if currency_from != "USD":
        # We only have rates from USD to others, so need to compute indirect
        usd_to_from = rates.get(currency_from)
        usd_to_to = rates.get(currency_to)
        if usd_to_from and usd_to_to:
            return usd_to_to / usd_to_from
        return None
    
    return rates.get(currency_to)



def fetch_and_save_daily_rates():
    from apps.Transaction.models import DailyExchangeRate
    
    url = "https://open.er-api.com/v6/latest/"
    response = requests.get(url)
    response.raise_for_status()
    data = response.json()

    if data.get("result") != "success":
        raise Exception("Failed to fetch exchange rates")

    date_str = data["time_last_update_utc"]
    date_obj = datetime.strptime(date_str, "%a, %d %b %Y %H:%M:%S %Z").date()

    base_code = data["base_code"]
    rates = data["rates"]

    obj, created = DailyExchangeRate.objects.update_or_create(
        date=date_obj,
        defaults={
            "base_code": base_code,
            "rates": rates,
        }
    )

    return obj, created