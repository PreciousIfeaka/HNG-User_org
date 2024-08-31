const swaggerJsdoc = require("swagger-jsdoc");
const { version } = require("../package.json");
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
      url: `http://localhost:${process.env.SERVER_PORT}/`,
      description: "Local server",
    },
    {
      url: "https://hng-user-org.vercel.app/",
      description: "Live server",
    },
  ],
  tags: [
    {
      name: "default",
      description: "A list of all default routes",
    },
    {
      name: "Authentication",
      description: "A list of routes for Authentication",
    },
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
    "./routers/*.js",
    "./controllers/*.js",
    "./docs/*.js",
  ],
};

const specs = swaggerJsdoc(options);

module.exports = specs;
