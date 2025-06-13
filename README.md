
## One-to-One Chat API Endpoints

These are the REST API endpoints you'll create within your `chatting` app, assuming they are prefixed with `/api/chat/`.

---

### 1. List & Create Conversations

**Endpoint:** `GET /api/chat/conversations/`
* **Purpose:** Retrieve all one-to-one conversations the **authenticated user** is involved in.
* **Data (Response):** An array of conversation objects. Each object includes:
    * `id`: Unique ID of the conversation.
    * `user1`, `user2`: Detailed objects of the two participants (e.g., `id`, `username`).
    * `created_at`: Timestamp of conversation creation.
    * `last_message`: (Optional) The most recent message in the conversation.
* **Conditions:** User must be authenticated.

**Endpoint:** `POST /api/chat/conversations/`
* **Purpose:** Initiate a new conversation with a specific user. If a conversation already exists between the two users, it returns the existing one.
* **Data (Request Body):**
    ```json
    {
        "target_user_id": <ID of the other user>
    }
    ```
* **Data (Response):** A single conversation object (newly created or existing).
* **Conditions:**
    * User must be authenticated.
    * `target_user_id` must correspond to a valid, existing user.
    * `target_user_id` cannot be the authenticated user's ID.

---

### 2. Retrieve Message History

**Endpoint:** `GET /api/chat/conversations/{conversation_id}/messages/`
* **Purpose:** Fetch a paginated list of historical messages for a specific conversation.
* **URL Parameters:**
    * `conversation_id`: The unique ID of the conversation.
* **Data (Response):** A paginated array of message objects. Each object includes:
    * `message_id`: Unique ID of the message.
    * `sender`: Detailed object of the sender (e.g., `id`, `username`).
    * `content`: The message text.
    * `timestamp`: When the message was sent.
    * `read`: Boolean indicating if the message has been read by the recipient (optional).
* **Conditions:**
    * User must be authenticated.
    * User must be a participant in the specified `conversation_id`.
    * `conversation_id` must exist.

---

### WebSocket Endpoint (Real-time)

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