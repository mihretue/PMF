import requests

EXCHANGE_RATE_API_URL = "https://open.er-api.com/v6/latest/USD?apikey=e51230e41ec1f00c47836b73"

def fetch_exchange_rates():
    """Fetch exchange rates from an external API."""
    response = requests.get(EXCHANGE_RATE_API_URL)
    
    if response.status_code == 200:
        data = response.json()
        return {currency: rate for currency, rate in data.get("rates", {}).items() if currency in ["EUR", "GBP", "KES", "NGN", "ETB"]}

    return None
