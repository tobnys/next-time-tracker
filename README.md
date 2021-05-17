## Getting started

1. yarn
2. npx prisma migrate dev
3. yarn start


## REST API documentation

### `GET`

- `/api/session/:id`: Fetch a single session by its `id`
- `/api/user/:token`: Fetch user by `token`

### `POST`

- `/api/session`: Create a new session
  - Body:
    - `userId: Number` (required): User author
    - `name: String` (optional): Name of the session
    - `sessionStartDate: String` (required): Start date of the session
    - `sessionEndDate: String` (optional): End date of the session
    - `activeTime: Number` (required): Total active time elapsed in seconds
- `/api/user`: Create a new user
  - Body:
    - `token: String` (required): Session (cookie) token

### `PUT`

- 

### `DELETE`
  
- 