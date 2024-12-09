# README.md

## Database schema for booths

- `booth_id: str`
- `event_id: int`
- `organizer_id: int`
- `availability_status: str`
- `booth_image: str`
- `booth_title: str`
- `duration: int`
- `price: float`
- `size: int`
- `created_at: timestamp`
- `updated_at: timestamp`

## API:

### 1. Create Booth

- **Endpoint:** `/booths/`
- **Method:** `POST`
- **Description:** Creates a new booth listing. Only the user who is the organizer can create a booth with their `organizer_id`.

- **Query Parameters:**
  - `user_id` (string, required): ID of the user creating the booth.

- **Headers:**
  - `Content-Type`: `application/json`

- **Request Body:**

  ```json
  {
    "event_id": "string",
    "organizer_id": "string",
    "booth_title": "string",
    "booth_image": "string (optional)",
    "price": 0.0,
    "size": 10,
    "duration": 10,
    "availability_status": "available" | "booked" | "unavailable"
  }

### 2. Get Booth using booth id

- **Endpoint:** `/booths/{booth_id}`
- **Method:** `GET`
- **Description:** Retrieves a specific booth by its `booth_id`.

- **Path Parameters:**
  - `booth_id` (string, required): Unique identifier of the booth.

### 3. Get all Booths

- **Endpoint:** `/booths/`
- **Method:** `GET`
- **Description:**  Retrieves a list of booths with an optional limit on the number of booths returned.

- **Query Parameters:**
  - `limit (integer, optional)`: Number of booths to retrieve. Defaults to 100. Maximum allowed is 1000.

### 4. Update Booth

- **Endpoint:** `/booths/{booth_id}`
- **Method:** `PUT`
- **Description:** Updates an existing booth. Only the organizer can update their booth.

- **Path Parameters:**
  - `booth_id` (string, required): Unique identifier of the booth.
  - 
- **Query Parameters:**
  - `user_id` (string, required): ID of the user attempting to update the booth.

- **Headers:**
  - `Content-Type`: `application/json`

- **Request Body:**

```json
{
    "booth_title": "string (optional)",
    "booth_image": "string (optional)",
    "price": 0.0,
    "size": "string (optional)",
    "duration": "string (optional)",
    "availability_status": "available" | "booked" | "unavailable"
}
```

### 4. Delete Booth

- **Endpoint:** `/booths/{booth_id}`
- **Method:** `DELETE`
- **Description:** Deletes a booth. Only the organizer can delete their booth.

- **Path Parameters:**
  - `booth_id` (string, required): Unique identifier of the booth.
  
- **Query Parameters:**
  - `user_id` (string, required): ID of the user attempting to delete the booth.