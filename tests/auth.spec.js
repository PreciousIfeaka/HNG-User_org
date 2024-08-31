// auth.spec.js
process.env.NODE_ENV = 'test';

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const jwt = require("jsonwebtoken");
const request = require('supertest');
const app = require('../app'); // Adjust the path to your server file

describe('Register Auth API Tests', () => {
  it('should register a user successfully and return response', async () => {
    const user = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'jp@example.com',
      password: 'password123',
      phone: '1234567890',
    };

    const response = await request(app)
      .post('/auth/register')
      .send(user);

    // Assert HTTP response status and successful registration
    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      status: 'success',
      message: 'Registration successful',
      data: {
        accessToken: expect.any(String), // Check accessToken is a string
        user: {
          userId: expect.any(String), // Check userId is a string
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
        }
      }
    });

    // Assert default organisation name is correctly generated
    const orgName = await prisma.user.findUnique({
      where: {
        email: response.body.data.user.email
      },
      include: {
        organisations: true
      }
    })
    expect(orgName.organisations[0].name).toBe(`${user.firstName}'s Organisation`);
  });

  it('Should fail when user enters an existing email', async () => {
    const reguser = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@example.com',
      password: 'password123',
      phone: '1234567890',
    };

    const response = await request(app)
      .post('/auth/register')
      .send(reguser);

    // Assert HTTP response status and successful registration
    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      statusCode: 422,
      message: "User already exists"
    });

    // Assert default organisation name is correctly generated
    const orgName = await prisma.user.findUnique({
      where: {
        email: reguser.email
      },
      include: {
        organisations: true
      }
    })
    expect(orgName.organisations[0].name).toBe(`${reguser.firstName}'s Organisation`);
  });


  it("Should handle input fields validation and return the necessary response", async () => {
    const registerUser = {
      firstName: 'John',
      lastName: 24,
      email: 'johnd@example.com',
      password: 'password123',
      phone: "1234567890"
    };

    const response = await request(app)
      .post('/auth/register')
      .send(registerUser);

    // Assert HTTP response status and validation response
    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      "errors": [
        {
          "field": "lastName",
          "message": "lastName must be a string"
        }
    ]
    });
  });

  it("Should fail if any required input is missing and return the necessary response", async () => {
    const registerUser = {
      lastName: "Ijele",
      email: 'johnd@example.com',
      password: 'password123',
      phone: "1234567890"
    };

    const response = await request(app)
      .post('/auth/register')
      .send(registerUser);

    // Assert HTTP response status and validation response
    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      "errors": [
        {
            field: "firstName",
            message: "firstName must be a string"
        },
        {
            field: "firstName",
            message: "First name must not be null"
        }
    ]
    });
  });

  it("Should fail if any required input is missing and return the necessary response", async () => {
    const registerUser = {
      lastName: "Ijele",
      email: 'johnd@example.com',
      password: 'password123',
      phone: "1234567890"
    };

    const response = await request(app)
      .post('/auth/register')
      .send(registerUser);

    // Assert HTTP response status and validation response
    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      "errors": [
        {
            field: "firstName",
            message: "firstName must be a string"
        },
        {
            field: "firstName",
            message: "First name must not be null"
        }
    ]
    });
  });

  it("Should fail if phone is not a string and return the necessary response", async () => {
    const registerUser = {
      firstName: "Ganacho",
      lastName: "Ijele",
      email: 'johnd@example.com',
      password: 'password123',
      phone: 1234567890
    };

    const response = await request(app)
      .post('/auth/register')
      .send(registerUser);

    // Assert HTTP response status and validation response
    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      "errors": [
        {
            "field": "phone",
            "message": "Phone must be a string"
        }
    ]
    });
  });
});

describe('Login API Tests', () => {
  it('should login a user successfully and return response object', async () => {
    const user = {
      email: 'jn@example.com',
      password: 'password123',
    };

    const response = await request(app)
      .post('/auth/login')
      .send(user);

    // Assert HTTP response status and successful registration
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: 'success',
      message: 'Login successful',
      data: {
        accessToken: expect.any(String), // Check accessToken is a string
        user: {
          userId: expect.any(String), // Check userId is a string
          firstName: response.body.data.user.firstName,
          lastName: response.body.data.user.lastName,
          email: response.body.data.user.email,
          phone: response.body.data.user.phone,
        }
      }
    });
  });

  it("Invalid login details returns the correct response", async () => {
    const user = {
      email: 'johndiva@example.com',
      password: 'password123',
    };

    const response = await request(app)
      .post('/auth/login')
      .send(user);

    // Assert HTTP response status and successful registration
    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      "status": "Bad request",
      "message": "Authentication failed",
      "statusCode": 401
    });
  });

  it("Should handle accessToken expiration", async () => {
    // Create a user and get the access token
    const user = {
      email: 'ze@example.com',
      password: 'password123',
    };

    const registerResponse = await request(app)
      .post('/auth/login')
      .send(user);

    expect(registerResponse.status).toBe(200);
    const { accessToken } = registerResponse.body.data;

    // Decode the token to get its payload and check its expiration time
    const decodedToken = jwt.decode(accessToken);
    const tokenExpirationTime = decodedToken.exp * 1000; // Convert to milliseconds

    // Set a timeout to wait for the token to expire
    const currentTime = Date.now();
    const waitTime = tokenExpirationTime - currentTime + 1000; // Add 1 second buffer
    await new Promise((resolve) => setTimeout(resolve, waitTime));

    // Attempt to access a protected route with the expired token
    const protectedResponse = await request(app)
      .get('/api/organisations') // Adjust to your protected route
      .set('Authorization', `Bearer ${accessToken}`);

    // Assert that the request is unauthorized due to expired token
    expect(protectedResponse.status).toBe(403);
    expect(protectedResponse.body).toEqual({
      status: 403,
      error: "Forbidden"
    });
  }, 3610000);
});