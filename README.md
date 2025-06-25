# PMF Project Documentation

## Overview

**PMF** is a Django-based financial platform that provides:
- Money transfers with escrow
- Foreign currency requests and exchange
- Wallet management
- Real-time and daily exchange rates
- User-configurable currency alerts
- Transaction logging and notifications

This documentation covers all core apps, their main logic, and usage instructions.

---

## Table of Contents

1. [Project Structure](#project-structure)
2. [Apps and Their Logic](#apps-and-their-logic)
    - [accounts](#accounts)
    - [transactions](#transactions)
    - [wallets](#wallets)
    - [exchange](#exchange)
    - [notifications](#notifications)
    - [escrow](#escrow)
3. [Setup Instructions](#setup-instructions)
4. [API Usage](#api-usage)
5. [Currency Alerts & Celery Tasks](#currency-alerts--celery-tasks)
6. [Environment & Deployment](#environment--deployment)

---

## Project Structure

```
PMF/
├── apps/
│   ├── accounts/
│   ├── transactions/
│   ├── wallets/
│   ├── exchange/
│   ├── notifications/
│   ├── escrow/
├── manage.py
├── requirements.txt
├── docs/
│   └── README.md
```

---

## Apps and Their Logic

### 1. accounts

**Purpose:**  
Handles user registration, login, authentication, and user profile management.

**Key Features:**
- Custom user model (often with email as username)
- JWT authentication
- Permissions classes (e.g., `IsSender`, `IsReceiver`, `IsVerifiedUser`)

**Usage:**  
Register/login via `/api/auth/register/`, `/api/auth/login/`.  
Most endpoints require authentication via JWT token in the `Authorization` header.

---

### 2. transactions

**Purpose:**  
Manages all transaction logic, including money transfers and foreign currency requests.

**Key Features:**
- Money Transfer API: create, view, cancel, upload proof
- Foreign Currency Request API: create, view, upload proof
- Transaction logs

**Usage:**
- Initiate a transfer: `POST /api/money-transfers/`
- Cancel a transfer: `POST /api/money-transfers/{id}/cancel/`
- View your transactions: `GET /api/my-transactions/money-transfers/`  
- Upload proof: `PATCH /api/money-transfers/{id}/upload-proof/`

---

### 3. wallets

**Purpose:**  
Manages user and system wallets for different currencies.

**Key Features:**
- Create wallets on user registration
- Track balances and enforce sufficient funds before transfers
- Update balances on transaction completion

**Usage:**
- Wallets are automatically managed in the backend.
- Admins can view all wallets, users can view their own.

---

### 4. exchange

**Purpose:**  
Handles currency rates, both live and daily historical, and currency alerting.

**Key Features:**
- Real-time exchange rate fetch (`get_live_exchange_rate`)
- Daily exchange rate model (for history)
- Currency alert creation, updating, deletion
- Celery tasks to update rates and check alerts

**Usage:**
- Get rates: `GET /api/exchange-rates/`
- Get live rate: `GET /api/get-exchange-rate/live/?from=USD&to=ETB`
- Set a currency alert: `POST /api/currency-alerts-create/`
- View rate history: `GET /api/exchange-rate/history/`

---

### 5. notifications

**Purpose:**  
Handles user notifications for events (transaction status, currency alert triggers).

**Key Features:**
- Notification model linked to user
- Backend logic to create notifications on transaction events
- Celery/Email notification for currency alerts

**Usage:**
- Notifications are sent automatically when relevant events occur.
- Users can view their notifications (API or frontend).

---

### 6. escrow

**Purpose:**  
Ensures safe holding of funds during transactions.

**Key Features:**
- Escrow model tracks status: pending, funds_held, released, disputed, refunded
- Each transaction is linked to an escrow object
- Status auto-syncs with the main transaction

**Usage:**
- Users do not interact directly; escrow is managed by the backend during transaction processing.

---

## Setup Instructions

1. **Clone the repository and install dependencies:**
    ```sh
    git clone https://github.com/mihretue/PMF.git
    cd PMF
    python -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    ```

2. **Configure environment variables:**
    - Copy `.env.example` to `.env` and fill in required variables (DB credentials, email, cloud storage, etc).

3. **Apply migrations and create superuser:**
    ```sh
    python manage.py migrate
    python manage.py createsuperuser
    ```

4. **Run the development server:**
    ```sh
    python manage.py runserver
    ```

5. **Start Celery (for background tasks):**
    ```sh
    celery -A PMF worker -l info
    celery -A PMF beat -l info
    ```

---

## API Usage

**Authentication:**  
Obtain your token via `/api/token/` and include in headers:

```
Authorization: Bearer <your_token>
```

### Key Endpoints

| Endpoint | Method | Description | Auth |
|---|---|---|---|
| /api/money-transfers/ | GET, POST | List or create money transfer | Yes |
| /api/money-transfers/{id}/cancel/ | POST | Cancel a pending transfer | Yes |
| /api/foreign-currency-requests/ | GET, POST | List or create foreign request | Yes |
| /api/currency-alerts-create/ | POST | Create a currency alert | Yes |
| /api/currency-alerts-update/{id}/ | PATCH | Update a currency alert | Yes |
| /api/currency-alerts/{id}/ | DELETE | Delete a currency alert | Yes |
| /api/get-exchange-rate/live/ | GET | Get live rate, e.g. `?from=USD&to=ETB` | No |

**Sample: Create a currency alert**

```http
POST /api/currency-alerts-create/
Authorization: Bearer <token>
Content-Type: application/json

{
  "base_currency": "USD",
  "target_currency": "ETB",
  "target_rate": "57.25",
  "notify_interval": "01:00:00"
}
```

---

## Currency Alerts & Celery Tasks

- **CurrencyAlert** model stores each user's alert and the threshold/range.
- **check_currency_alerts** Celery task runs periodically:
    - Fetches all active alerts, checks current rates.
    - If the rate is within user’s range and enough time has passed, sends an email notification and records the notification time.

- **update_exchange_rates_task** Celery task runs periodically to fetch and update current base rates.

**To enable these:**
- Make sure Celery workers and beat are running (see Setup above).
- Configure email backend in your environment.

---

## Environment & Deployment

- **Environment variables:**  
    - DB config, secret key, email, cloud storage, etc.
- **Production deployment:**  
    - Use Gunicorn + Nginx.
    - Set `DEBUG=False` and configure allowed hosts.
    - Use proper email backend for notifications.

---

## Support

For questions or issues, please open an issue in the repository.
