const swaggerJsdoc = require("swagger-jsdoc");
const { version } = require("../package.json");
const path = require("path");
require("dotenv").config();

const swaggerDefinition = {
  openapi: "3.1.0",
  info: {
    title: "HNG User-Organisation API",
    version: version,
    description: "OpenApi documentation for the user-organization management project",
  },
  servers: [
    {
      url: "https://hng-user-org.vercel.app/",
      description: "Live server",
    },
    {
      url: `http://localhost:${process.env.SERVER_PORT}/`,
      description: "Local server",
    }
  ],
  tags: [
    {
      name: "Authentication",
      description: "A list of routes for Authentication",
    },
    {
      name: "Organisations",
      description: "A list of routes for Organisation resources",
    },
    {
      name: "Users",
      description: "A list of routes for Users resources",
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ]
};

const options = {
  swaggerDefinition,
  apis: [
    path.resolve(__dirname, "../docs/auth.js"),
  ],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = { swaggerSpec };
