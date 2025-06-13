# One-to-One Chat API Endpoints

These are the REST API and WebSocket endpoints for the **chatting** app.  
All endpoints are prefixed with `/api/chat/`.

This document is for **backend developers** (for implementation) and **frontend developers** (for integration/testing).

---

## 1. Conversations (List & Create)

### `GET /api/chat/conversations/`

- **Purpose:**  
  Return all one-to-one conversations that the **authenticated user** is involved in.

- **Who can call:**  
  Any logged-in user.

- **Returns:**  
  ```json
  [
    {
      "id": 12,
      "user1": { "id": 8, "username": "alice" },
      "user2": { "id": 42, "username": "bob" },
      "created_at": "2024-06-12T10:00:00Z",
      "last_message": {
        "message_id": 77,
        "sender": { "id": 8, "username": "alice" },
        "content": "Hey Bob!",
        "timestamp": "2024-06-12T12:00:00Z"
      }
    },
    ...
  ]
  ```
  - `last_message` is optional; if present, it's the latest message in the conversation.

---

### `POST /api/chat/conversations/`

- **Purpose:**  
  Start a new conversation with another user, or return the existing conversation if it already exists.

- **Who can call:**  
  Any logged-in user.

- **Request body:**  
  ```json
  {
    "target_user_id": 42
  }
  ```
  - `target_user_id`: ID of the user to chat with (cannot be yourself).

- **Returns:**  
  ```json
  {
    "id": 17,
    "user1": { "id": 8, "username": "alice" },
    "user2": { "id": 42, "username": "bob" },
    "created_at": "2024-06-12T10:00:00Z",
    "last_message": null
  }
  ```
  - Returns the newly created or already existing conversation object.

- **Rules:**  
  - If a conversation already exists between the two users, the API **must** return the existing object, not create a duplicate.

---

## 2. Conversation Message History

### `GET /api/chat/conversations/{conversation_id}/messages/`

- **Purpose:**  
  Get a paginated list of messages for a conversation.

- **Who can call:**  
  Any logged-in user who is a participant in that conversation.

- **Path parameter:**  
  - `conversation_id` (integer): The conversation to fetch messages for.

- **Returns:**  
  ```json
  {
    "count": 23,
    "next": "/api/chat/conversations/1/messages/?page=2",
    "previous": null,
    "results": [
      {
        "message_id": 77,
        "sender": { "id": 8, "username": "alice" },
        "content": "Hey Bob!",
        "timestamp": "2024-06-12T12:00:00Z",
        "read": true
      },
      ...
    ]
  }
  ```
  - Standard DRF pagination fields: `count`, `next`, `previous`, `results`
  - Each message includes:
    - `message_id`
    - `sender` (object)
    - `content`
    - `timestamp`
    - `read` (optional)

- **Rules:**  
  - Only participants can access this endpoint.
  - If not a participant or conversation doesn't exist, return 404 or 403.

---

## 3. Real-time Messaging (WebSocket)

### `ws://your-api-domain/ws/chat/{conversation_id}/?token=YOUR_JWT`

- **Purpose:**  
  Real-time chat: send and receive messages instantly in a conversation.

- **Who can connect:**  
  Authenticated users who are participants in the conversation.

- **WebSocket URL:**
  - `{conversation_id}`: The conversation to join.
  - `token`: Pass your JWT as a query parameter for authentication.

- **To send a message (from frontend):**
  ```json
  {
    "message": "Hello from the frontend!"
  }
  ```

- **To receive a message (from backend):**
  ```json
  {
    "type": "chat_message",
    "message": "Hello from the backend!",
    "sender_id": 8,
    "sender_username": "alice",
    "timestamp": "2024-06-12T12:00:00Z",
    "message_id": 77
  }
  ```

- **Rules:**  
  - Only authenticated users can connect.
  - Only participants in the conversation can send/receive.
  - Invalid token or non-participant: reject the connection.

---

## Quick Reference for Frontend

| API Endpoint                                           | Method | Request Body / Params           | Returns                  |
|--------------------------------------------------------|--------|---------------------------------|--------------------------|
| `/api/chat/conversations/`                             | GET    | —                               | List of conversations    |
| `/api/chat/conversations/`                             | POST   | `{ "target_user_id": <int> }`   | Conversation object      |
| `/api/chat/conversations/{conversation_id}/messages/`  | GET    | Paginated, DRF style            | List of message objects  |
| `ws://.../ws/chat/{conversation_id}/?token=YOUR_JWT`   | WS     | `{ "message": "..." }`          | Real-time chat messages  |

---

## Notes for Backend Developers

- Return 400 if `target_user_id` is invalid or self in `POST /conversations/`.
- Return 404/403 if user is not a participant for any conversation or message history endpoint.
- Paginate messages (DRF pagination).
- On POST, check for an existing conversation before creating a new one.
- WebSocket authentication: check JWT, reject if invalid or not a participant.
- Extend models as needed (e.g., add `last_message` to conversation serializer via `SerializerMethodField`).

---

## Notes for Frontend Developers

- You must include a valid JWT for all API and WS calls (use Authorization header for REST, `?token=` for WS).
- For message history, handle pagination (use `next` URL).
- After POSTing to `/conversations/`, use the returned conversation's ID for further actions.
- Listen for real-time updates on WebSocket; reconnect and re-authenticate as needed.
