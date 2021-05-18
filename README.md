## Summary

Solution for the Pento tech challenge.

## Getting started

1. yarn
2. npx prisma migrate dev
3. yarn start

## Tech stack

This full-stack application can be run solely through a framework called Next which is a full-stack framework designed to streamline application creation in a very dynamic way.

Database layer is SQLite with Prisma as the ORM.

React is used along with TypeScript.

Basic CSS modules for styling.

## REST API documentation

### `GET`

- `/api/sessions/:id`: Fetch a single session by its `id`
- `/api/user/:token`: Fetch user by their `token`
- `/api/user/:token/sessions`: Fetch sessions from a single user, identifying the user by their `token`

### `POST`

- `/api/sessions`: Create a new session
  - Body:
    - `userId: Number` (required): User author
    - `name: String` (optional): Name of the session
    - `sessionStartDate: String` (required): Start date of the session
    - `sessionEndDate: String` (optional): End date of the session
    - `activeTime: Number` (required): Total active time elapsed in seconds
- `/api/user`: Create a new user
  - Body:
    - `token: String` (required): Session (cookie) token
