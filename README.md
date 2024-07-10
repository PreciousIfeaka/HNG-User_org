# HNG-User-org

## Overview

**HNG-User-org** is a backend project for user authentication and organisation management. It allows users to register, log in, and manage organisations they belong to or have created. This project is built using Node.js, Express, and PostgreSQL with Prisma ORM.

## Task Criteria

The project adheres to the following criteria:

1. **User Model:**
   - `userId` (string, unique)
   - `firstName` (string, required)
   - `lastName` (string, required)
   - `email` (string, unique, required)
   - `password` (string, required)
   - `phone` (string)

2. **Validation:**
   - All fields are validated.
   - On validation error, returns status code 422 with an appropriate error message.

3. **User Authentication:**
   - **Registration:** Endpoint for user registration with password hashing.
   - **Login:** Endpoint for user login using JWT for protected endpoints.

4. **Organisation Management:**
   - A user can belong to multiple organizations.
   - An organisation can contain multiple users.
   - On registration, a default organisation is created with the user’s first name.

5. **Organisation Model:**
   - `orgId` (string, unique)
   - `name` (string, required)
   - `description` (string)

## Endpoints

### User Authentication

- **POST /auth/register:** Registers a user and creates a default organisation.
  - **Request Body:**
    ```json
    {
      "firstName": "string",
      "lastName": "string",
      "email": "string",
      "password": "string",
      "phone": "string"
    }
    ```
  - **Successful Response:**
    ```json
    {
      "status": "success",
      "message": "Registration successful",
      "data": {
        "accessToken": "jwt",
        "user": {
          "userId": "string",
          "firstName": "string",
          "lastName": "string",
          "email": "string",
          "phone": "string"
        }
      }
    }
    ```

- **POST /auth/login:** Logs in a user.
  - **Request Body:**
    ```json
    {
      "email": "string",
      "password": "string"
    }
    ```
  - **Successful Response:**
    ```json
    {
      "status": "success",
      "message": "Login successful",
      "data": {
        "accessToken": "jwt",
        "user": {
          "userId": "string",
          "firstName": "string",
          "lastName": "string",
          "email": "string",
          "phone": "string"
        }
      }
    }
    ```

### User Management

- **GET /api/users/:id:** Retrieves a user’s record (protected).

### Organization Management

- **GET /api/organisations:** Retrieves all organizations the user belongs to or created (protected).
- **GET /api/organisations/:orgId:** Retrieves a single organization record (protected).
- **POST /api/organisations:** Creates a new organization (protected).
  - **Request Body:**
    ```json
    {
      "name": "string",
      "description": "string"
    }
    ```
  - **Successful Response:**
    ```json
    {
      "status": "success",
      "message": "Organisation created successfully",
      "data": {
        "orgId": "string",
        "name": "string",
        "description": "string"
      }
    }
    ```

- **POST /api/organisations/:orgId/users:** Adds a user to a specific organization.
  - **Request Body:**
    ```json
    {
      "userId": "string"
    }
    ```

## Installation

1. Clone the repository:
   ```sh
   git clone https://yourgittoken@github.com/yourusername/HNG-User-org.git
   cd HNG-User-Org
   ```
2. Install dependencies
   ```sh
   npm install
   ```
3. Set up environmental variables
   Create a .env file and add your PostgreSQL database configuration and JWT secret.
4. Prisma setup
   - Initialize prisma in your project
     ```sh
     npx prisma init
     ```
   - Migrate your database
     ```sh
     npx prisma migrate dev --name init
     ```
   - Generate the prisma client
     ```sh
     npx prisma generate
     ```

## Testing
To run the unit and end-to-end tests, use
```sh
npm test
```

## Technologies used
- Node.js
- Express
- PostgreSQL
- Prisma ORM
- JWT from jsonwebtoken for authentication

## Acknowledgements
Thanks to the HNG team for this task
