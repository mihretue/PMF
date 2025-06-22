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

## License

MIT License.
