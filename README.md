# PMF Notification System

## Overview

The **Notification** app provides a centralized way to inform users about important events across the PMF platform. It is designed for easy integration with other Django apps (KYC, Transaction, Escrow, PaymentTransaction, etc.) and is extensible for future needs.

---

## Notification Model

**Location:** `apps/Notifications/models.py`

| Field         | Type        | Description                                      |
|---------------|-------------|--------------------------------------------------|
| user          | FK to User  | The recipient of the notification                |
| message       | TextField   | The notification message                         |
| created_at    | DateTime    | When the notification was created                |
| read          | Boolean     | Has the user read the notification? (default: no)|
| type          | CharField   | Optional: category of notification (info, alert) |

---

## Endpoints & Parameters

You can create views to expose notifications through the API (for example: `apps/Notifications/views.py`):

- **GET `/api/notifications/`**  
  **Description:** List all notifications for the authenticated user.  
  **Query Parameters:**  
    - `read` (optional): Filter by read/unread status (`true` or `false`).

- **POST `/api/notifications/`**  
  **Description:** Create a notification (usually used by internal logic, not by end-users).  
  **Body Parameters:**  
    - `user` (required): User ID or username (FK to User)
    - `message` (required): Text message
    - `type` (optional): Category
    - _Other fields are auto-set or managed internally_

- **PATCH `/api/notifications/<id>/`**  
  **Description:** Update a notification (e.g., mark as read).  
  **Body Parameters:**  
    - `read`: Boolean

- **DELETE `/api/notifications/<id>/`**  
  **Description:** Delete a notification.

---

## Integration with Other Apps

### What Was Modified

**In each integrated app, we added logic to create notifications when important events occur:**

| App                  | Event/Action                          | Notification Triggered                                                   |
|----------------------|---------------------------------------|--------------------------------------------------------------------------|
| KYC                  | User submits KYC                      | "Your KYC has been submitted and is under review."                       |
|                      | Admin approves/rejects KYC            | "Your KYC has been approved." / "Your KYC was rejected."                 |
| Transaction          | Money transfer created                | "Your money transfer ... has been initiated and funds are now in escrow." |
|                      | Money transfer canceled               | "Your money transfer ... has been canceled."                             |
| Foreign Currency Req | Request created                       | "Your foreign currency request ... has been submitted and escrowed."      |
| PaymentTransaction   | Payment completed                     | "Your payment (Transaction ID: ...) of $X has been received and is in escrow." |

**How:**  
- In each app’s view (or business logic), after the event, we added:

    ```python
    from apps.Notifications.models import Notification
    # ...
    try:
        Notification.objects.create(
            user=target_user,
            message="Your custom message"
        )
    except Exception:
        pass  # Do not break the main logic if notifications fail
    ```

---

### What You Can Add

- **Notification types:** Add a `type` field to categorize notifications (info, warning, transaction, kyc, etc.).
- **Mark as read/unread:** Use the `read` field for user-facing notification panels.
- **Bulk actions:** Add endpoints or admin actions to mark all as read or delete multiple notifications.
- **Email/push integration:** Extend model or signals to send emails or push notifications.
- **User settings:** Allow users to mute certain notification types.

---

### How to Add a Notification

1. **Import the model:**
    ```python
    from apps.Notifications.models import Notification
    ```
2. **Create a notification:**
    ```python
    try:
        Notification.objects.create(
            user=target_user,
            message="Your notification message",
            type="info"  # Optional
        )
    except Exception:
        pass
    ```

---

### How to Delete a Notification

- **In Django Admin:** Go to Notifications, select and delete.
- **Via API:**  
  ```http
  DELETE /api/notifications/<id>/
  ```

---

### How to Mark as Read

- **Via API:**
  ```http
  PATCH /api/notifications/<id>/
  {
    "read": true
  }
  ```

---

## Example: Using Notifications in Your Code

```python
from apps.Notifications.models import Notification

# When a user submits KYC
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

## For Developers

- **Always wrap `Notification.objects.create()` in try/except** to avoid breaking business logic.
- **Update docstrings/comments** in views where notifications are fired explaining why.
- **If you add new notification logic, document it here for your team!**

---

## CHANGELOG (What was added/modified)

- Integrated notifications across KYC, Transaction, Escrow, and PaymentTransaction apps.
- Added try/except error handling for notification dispatch.
- Improved Notification model to include `read` and `type` fields (optional).
- Added sample endpoints and usage documentation.

---
