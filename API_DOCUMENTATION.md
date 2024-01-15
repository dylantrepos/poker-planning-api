# API Documentation

## Users

### Get all users

**Endpoint:** `GET /users`

**Description:** Returns a list of all users.

**Response:**

- `200 OK` on success

```json
[
  {
    "name": "User's name",
    "email": "User's email"
  }
]
```

### Create a new user

**Endpoint:** `POST /users`

**Description:** Creates a new user.

**Parameters:**

- `name`: User's name
- `email`: User's email (optional)

**Response:**

- `201 Created` on success

```json
{
  "message": "Success message"
}
```

### Get a user by ID

**Endpoint:** `GET /users/:id`

**Description:** Returns a specific user by ID.

**Parameters:**

- `id`: User's ID

**Response:**

- `200 OK` on success

```json
{
  "name": "User's name",
  "email": "User's email"
}
```

### Update a user

**Endpoint:** `PUT /users/:id`

**Description:** Updates a specific user by ID.

**Parameters:**

- `id`: User's ID
- `name`: User's name (optional)
- `email`: User's email (optional)

**Response:**

- `200 OK` on success

```json
{
  "message": "Success message"
}
```

### Delete a user

**Endpoint:** `DELETE /users/:id`

**Description:** Deletes a specific user by ID.

**Parameters:**

- `id`: User's ID

**Response:**

- `200 OK` on success

```json
{
  "message": "Success message"
}
```
