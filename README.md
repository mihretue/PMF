<<<<<<< HEAD
<<<<<<< HEAD
=======
# Notifications App
>>>>>>> Mihretu/Integrate

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

<<<<<<< HEAD
**Endpoint:** `ws://your-api-domain/ws/chat/{conversation_id}/`
* **Purpose:** Establish a real-time, bi-directional connection for sending and receiving chat messages instantly.
* **Data (Sending from Frontend):**
    ```json
    {
        "message": "Hello from the frontend!"
    }
    ```
* **Data (Receiving from Backend):**
    ```json
    {
        "type": "chat_message",
        "message": "Hello from the backend!",
        "sender_id": <Sender's User ID>,
        "sender_username": "sender_name",
        "timestamp": "ISO_8601_datetime_string",
        "message_id": <Message ID from DB>
    }
    ```
* **Conditions:**
    * User must be authenticated (typically by passing a token in the WebSocket URL query params like `ws://.../?token=YOUR_JWT`).
    * User must be a participant in the specified `conversation_id`.
    * `conversation_id` must exist.
=======
# PMF Notification System

## Overview

The **Notification** app is a reusable Django app that provides a central way to notify users about important events across the PMF platform. It is integrated with other apps including KYC, Transaction, PaymentTransaction, and more. This enables users to receive timely updates about actions that affect them.

---

## Features

- Store notifications for any user-triggered or admin-triggered event.
- Mark notifications as read/unread.
- List notifications via a REST API.
- Extensible notification model (add type, url, etc.).
- Easy to integrate with other Django apps.

---

## Endpoints

| Endpoint                            | Method | Description                                      | Parameters                         |
|--------------------------------------|--------|--------------------------------------------------|------------------------------------|
| `/api/notifications/`                | GET    | List all notifications for the logged-in user     | `read` (optional, filter by read)  |
| `/api/notifications/<id>/read/`      | PATCH  | Mark a notification as read                       | None (marks `read=True`)           |

**Example request to mark notification as read:**

```http
PATCH /api/notifications/12/read/
{
=======
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
>>>>>>> Mihretu/Integrate
}
```

---

<<<<<<< HEAD
## Notification Model

| Field      | Type      | Description                                   |
|------------|-----------|-----------------------------------------------|
| user       | FK(User)  | Recipient                                     |
| message    | Text      | Notification message                          |
| created_at | DateTime  | Time of notification                          |
| read       | Boolean   | Whether user has read notification            |
| url        | Text      | (Optional) Deep-link for notification         |
| type       | Char      | (Optional) Category of notification           |

---

## Integration with Other Apps

### What was modified

- **KYC app:**  
  - Notifies user when KYC is submitted and when admin updates status (approved/rejected).
- **Transaction app:**  
  - Notifies sender when money transfer is created or canceled.
  - Notifies receiver/requester on foreign currency request.
- **PaymentTransaction app:**  
  - Notifies payer when payment is completed and escrowed.

**How:**  
In each app's view logic, after an important event, we add:
```python
from apps.Notifications.models import Notification
try:
    Notification.objects.create(
        user=target_user,
        message="Your relevant message here"
    )
except Exception:
    pass  # Never block main logic if notification fails
```

---

### How to Add a Notification

1. **Import model:**
    ```python
    from apps.Notifications.models import Notification
    ```
2. **Create a notification:**
    ```python
    Notification.objects.create(
        user=target_user,
        message="Your message",
        type="info",  # Optional
        url="/app/detail/123"  # Optional
    )
    ```

---

### How to Delete a Notification

- **Django Admin:**  
  Go to Notifications, select, and delete.
- **(If you add an API endpoint):**  
  `DELETE /api/notifications/<id>/`

---

### How to Mark as Read

- **API:**  
  `PATCH /api/notifications/<id>/read/` with empty or any data.

---

## For Developers

- **Always wrap notification creation in try/except** to avoid breaking business logic.
- **Document notification triggers** in code comments for clarity.
- **Add new notification logic as needed and update this README.**

---

## Changelog

- Integrated notifications with KYC, Transaction, PaymentTransaction apps.
- Added API endpoints for listing and marking notifications as read.
- Enhanced model for extensibility (type, url, read flag).
- Added admin integration for managing notifications.

---

## Example Usage

```python
from apps.Notifications.models import Notification

# In your view after a relevant event:
try:
    Notification.objects.create(
        user=request.user,
        message="Your KYC has been submitted and is under review.",
        type="kyc"
    )
except Exception:
    pass
```

---

## Contact

For questions or contributions, please contact the PMF backend team.
>>>>>>> 13dac2c4de16da752f632670d7651b12f3f709e5
=======
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

## License

MIT License.
>>>>>>> Mihretu/Integrate
