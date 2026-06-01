# Welcome to Chirpyweb
This is a simple message board project to practice the setup of HTTP Servers.

## APIs
### GET /api/users
Returns a list of registered users.

**Response**
`200 OK`
```json
[
    {
        "id": "user's uuid",
        "createdAt": "yyyy-mm-ddThh:mm:ss.sssZ",
        "updatedAt": "yyyy-mm-ddThh:mm:ss.sssZ",
        "email": "registered email",
        "isChirpyRed": false
    }
]
```

### POST /api/users
Registers a new user account and returns the created user without the password hash.

**Request Body**
| Field       | Type      | Required  | Description   |
|-------------|-----------|-----------|---------------|
| `email`     | string    | Yes       | The new user's email address |
| `password`  | string    | Yes       | The password for the new account |

```json
{
    "email": "newuser@example.com",
    "password": "strong-password"
}
```

**Response**
`201 Created`
```json
{
    "id": "user's uuid",
    "createdAt": "yyyy-mm-ddThh:mm:ss.sssZ",
    "updatedAt": "yyyy-mm-ddThh:mm:ss.sssZ",
    "email": "newuser@example.com",
    "isChirpyRed": false
}
```

**Notes**
- Registration is required before login.
- The returned user object does not include `hashed_password`.

### PUT /api/users
Updates the authenticated user's email and password.

**Request Body**
| Field       | Type      | Required  | Description   |
|-------------|-----------|-----------|---------------|
| `email`     | string    | Yes       | The new email address |
| `password`  | string    | Yes       | The new password |

```json
{
    "email": "updated@example.com",
    "password": "new-password"
}
```

**Response**
`200 OK`
```json
{
    "id": "user's uuid",
    "createdAt": "yyyy-mm-ddThh:mm:ss.sssZ",
    "updatedAt": "yyyy-mm-ddThh:mm:ss.sssZ",
    "email": "updated@example.com",
    "isChirpyRed": false
}
```

**Notes**
- Requires a Bearer token in the `Authorization` header.

### POST /api/chirps
Returns a newly created chirp-message as body and anchored by userId.

**Request Body**
| Field       | Type      | Required  | Description   |
|-------------|-----------|-----------|---------------|
| `body`      | string    | Yes       | The chirp text, maximum 140 characters long   |

```json
{
    "body": "Chirp-text"
}
```

**Response**
`201 Created`
```json
{
    "id": "uuid-here",
    "createdAt": "yyyy-mm-ddThh:mm:ss.sssZ",
    "updatedAt": "yyyy-mm-ddThh:mm:ss.sssZ",
    "body": "bodyText",
    "userId": "userId"
}
```

**Notes**
- Requires a Bearer token in the `Authorization` header.

### GET /api/chirps
Returns a list of chirps, by default ordered by creation date ascending.

**Query Parameters**
| Parameter   | Type      | Required  | Description   |
|-------------|-----------|-----------|---------------|
| `authorId`    | string    | No        | If provided, filters results to chirps by that author |
| `sort`        | "asc" \|"desc"    | No        | Sort order by `createdAt`. Defaults to `"asc"`.    |

**Response**
`200 OK`
```json
[
    {
        "id": "uuid-here",
        "body": "chirp-text here",
        "userId": "author-uuid",
        "createdAt": "yyyy-mm-ddThh:mm:ss.sssZ",
        "updatedAt": "yyyy-mm-ddThh:mm:ss.sssZ"
    }
]
```

**Notes**
- Returns an empty array [] if no chirps match.
- Authentication is not required.

### DELETE /api/chirps/:chirpId
Delete a Chirp by `chirpId`.

**Path Parameters**
| Parameter | Type      | Description   |
|-----------|-----------|---------------|
| `chirpId` | string    | ID of the chirp to be deleted. |

**Response**
`204 No Content`

**Notes**
- Requires a Bearer token in the `Authorization` header.
- Users can only delete their own chirps.

### POST /api/login
Log in as user with password, returns safe login data, the token, the refresh token, and premium status (`chirpyRed`).

**Request Body**
| Field       | Type      | Required  | Description   |
|-------------|-----------|-----------|---------------|
| `email`     | string    | Yes       | The registered e-mail   |
| `password`  | string    | Yes       | The password set to the login e-mail    |

```json
{
    "email": "registered email",
    "password": "set password"
}
```

**Response**
`200 OK`
```json
{
    "id": "user's uuid",
    "createdAt": "yyyy-mm-ddThh:mm:ss.sssZ",
    "updatedAt": "yyyy-mm-ddThh:mm:ss.sssZ",
    "email": "registered email",
    "isChirpyRed": false,
    "token": "jwt-token",
    "refreshToken": "refresh-token"
}
```

**Notes**
- Registration is required before logging in.
- Use `token` as a Bearer token in the `Authorization` header for authenticated endpoints.
- The Token expires in 1 hour.
- Use refreshToken to obtain a new access token via POST /api/refresh.