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
}
```

---

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
