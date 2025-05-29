import requests

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
