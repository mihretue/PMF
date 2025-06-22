# Notifications App

This is a Django app for managing user notifications with a simple REST API.

---

## Features

- **List notifications** for the authenticated user.
- **Mark notifications as read**.
- **Delete notifications** (only your own).
- All endpoints require authentication.
- Each user can only access and manage their own notifications.

---

## API Endpoints

Base URL: `/api/notifications/`

| Method | Endpoint                        | Description                       | Request Body / Params |
|--------|---------------------------------|-----------------------------------|----------------------|
| GET    | `/api/notifications/`           | List all your notifications       | —                    |
| PATCH  | `/api/notifications/<pk>/read/` | Mark a notification as read       | —                    |
| DELETE | `/api/notifications/<pk>/delete/`| Delete a notification             | —                    |

- `pk` is the ID of the notification.

---

## Example Usage

### List Notifications

```http
GET /api/notifications/
Authorization: Token <your-token>
```

**Response:**
```json
[
  {
    "id": 1,
    "user": 5,
    "message": "You have a new message",
    "read": false,
    "created_at": "2025-06-13T00:53:00Z"
  },
  ...
]
```

---

### Mark Notification as Read

```http
PATCH /api/notifications/1/read/
Authorization: Token <your-token>
```

**Response:**
```json
{
  "id": 1,
  "user": 5,
  "message": "You have a new message",
  "read": true,
  "created_at": "2025-06-13T00:53:00Z"
}
```

---

### Delete Notification

```http
DELETE /api/notifications/1/delete/
Authorization: Token <your-token>
```

**Response:** HTTP 204 No Content

---

## Setup

1. **Add the app to `INSTALLED_APPS`** in your Django settings.

2. **Include the URLs** in your project's `urls.py`:
   ```python
   path('api/notifications/', include('notifications.urls')),
   ```

3. **Run migrations** (if you have a `Notification` model):
   ```bash
   python manage.py makemigrations notifications
   python manage.py migrate
   ```

---

## Permissions

- All endpoints require authentication.
- Users can only access and manage their own notifications.

---




# Currency Rate Alert (Set Alert) API — Documentation

This document explains how to use the "Set Alert" (Currency Rate Alert) feature in your Django backend, including all key modifications, API endpoint details, and expected request/response formats.

---

## 🔥 What is “Set Alert”?

The **Currency Rate Alert** feature allows users to set up alerts for currency exchange rates.  
When a rate falls within a user-defined range, the backend will create an in-app notification for the user.

---

## 🛠️ Backend Modifications

### 1. **Model**
- You already have `CurrencyAlert` in `Transaction/models.py`.
- Fields include:
  - `user`, `base_currency`, `target_currency`, `min_rate`, `max_rate`, `target_rate`, `is_active`, `notify_interval`, `created_at`, etc.

### 2. **Serializer**
- Enhanced to accept either:
  - A single `target_rate` (auto-calculates a min/max range), **or**
  - Both `min_rate` and `max_rate` explicitly.
- Ensures `user` and `created_at` are always read-only (set in views, not by user input).
- Validation ensures `min_rate < max_rate`.

### 3. **Views**
- Added `CreateCurrencyAlertView`, `UpdateCurrencyAlertView`, and `DeleteCurrencyAlertView`.
- Each requires authentication.
- The create view sets the alert for the logged-in user.
- Update and delete views ensure only the owner can modify/delete.

### 4. **Celery Task**
- The periodic task (`check_currency_alerts`) checks all active alerts.
- If the live rate is within a user’s defined range _and_ the notification interval has passed, it creates a Notification for the user.
- The frontend can fetch notifications using your existing notifications API.

### 5. **URLs**
- Endpoints are registered in `Transaction/urls.py`:
  - `POST   /transaction/currency-alerts/` — Create alert
  - `PATCH  /transaction/currency-alerts/<id>/` — Update alert
  - `DELETE /transaction/currency-alerts/<id>/delete/` — Delete alert

---

## 🚦 API Usage

### 1. **Create a Rate Alert**

**Endpoint:**  
`POST /transaction/currency-alerts/`

**Request Body:**  
- Option 1: With `target_rate` (auto-range, ~±1%)
```json
{
  "base_currency": "USD",
  "target_currency": "ETB",
  "target_rate": 55.50,
  "is_active": true,
  "notify_interval": "01:00:00"
}
```
- Option 2: With explicit range
```json
{
  "base_currency": "USD",
  "target_currency": "ETB",
  "min_rate": 55.0,
  "max_rate": 56.0,
  "is_active": true,
  "notify_interval": "01:00:00"
}
```

**Response:**
```json
{
  "message": "Alert created successfully."
}
```
*Validation errors will be returned if fields are missing or inconsistent.*

---

### 2. **Update an Alert**

**Endpoint:**  
`PATCH /transaction/currency-alerts/<id>/`

**Request Body:** (Any updatable field, e.g. set is_active to false)
```json
{
  "is_active": false
}
```
**Response:**  
```json
{
  "message": "Alert updated.",
  "data": {
    ... // updated alert fields
  }
}
```

---

### 3. **Delete an Alert**

**Endpoint:**  
`DELETE /transaction/currency-alerts/<id>/delete/`

**Response:**
```json
{
  "message": "Alert deleted."
}
```

---

### 4. **How Notification Works**

- The backend periodically checks all active alerts.
- If the current rate is within the user’s set range and enough time has passed since the last notification (`notify_interval`), a new Notification object is created for the user.
- Users can fetch their notifications via your existing `/notifications/` API endpoint.

---

## 🧑‍💻 Example Frontend Usage

1. **Set an alert:**  
   Make a POST request as shown above.
2. **Wait for the rate to match.**
3. **Your frontend polls `/notifications/` to show the user when an alert is triggered.**

---

## 📝 Example cURL

**Create:**
```sh
curl -X POST https://yourdomain.com/transaction/currency-alerts/ \
  -H "Authorization: Token <user_token>" \
  -H "Content-Type: application/json" \
  -d '{"base_currency": "USD", "target_currency": "ETB", "target_rate": 55.5, "is_active": true, "notify_interval": "01:00:00"}'
```

**Update:**
```sh
curl -X PATCH https://yourdomain.com/transaction/currency-alerts/4/ \
  -H "Authorization: Token <user_token>" \
  -H "Content-Type: application/json" \
  -d '{"is_active": false}'
```

**Delete:**
```sh
curl -X DELETE https://yourdomain.com/transaction/currency-alerts/4/delete/ \
  -H "Authorization: Token <user_token>"
```

---

## 🟢 Summary of Key Backend Files

- `models.py` — defines `CurrencyAlert`
- `serializers.py` — defines validation and field handling for alerts
- `views.py` — implements create, update, delete for alerts
- `tasks.py` — implements alert-checking Celery task
- `urls.py` — registers endpoints

---

## ⚠️ Notes

- The `user` field is never set by the client; it’s always assigned from the authenticated user in the view.
- `notify_interval` uses Django’s duration string format, e.g. `"01:00:00"` for one hour.
- "target_rate" is optional but, if provided, both min/max are automatically derived using ±1% of target.
- Client can also provide both min/max directly.

---

## 🧩 Integration Checklist

- [x] POST/PATCH/DELETE endpoints for alerts are in place.
- [x] Celery task notifies in-app via Notification model.
- [x] Frontend can set, update, delete alerts, and poll notifications.

---

For further expansion, see also:
- [CurrencyAlertSerializer validation logic](../serializers.py)
- [Periodic Celery alert-check task](../tasks.py)
- [Notification API usage](../Notifications/views.py)

## License

MIT License.
