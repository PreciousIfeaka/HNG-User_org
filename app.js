require("dotenv").config();
const cors = require("cors");
const express = require("express");
const swaggerUi = require('swagger-ui-express');
const userRouter = require("./routers/user.router");
const loginRouter = require("./routers/login.router");
const registerRouter = require("./routers/register.router");
const organisationsRouter = require("./routers/organisations.router");
const { swaggerSpec } = require("./config/swagger.config");

const app = express();

app.options("*", cors());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Authorization",
    ],
  }),
);

app.use(express.json());
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/auth", registerRouter);

app.use("/auth", loginRouter);

app.use("/api/users", userRouter);

app.use("/api", organisationsRouter);

app.get("/", (req, res) => {
  res.json({message: "I am the Express API responding for HNG user-org project"});
})

app.use("/openapi.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

app.use((req, res) => {
  const message = `Route not found: ${req.originalUrl}`;
  res.status(404).json({ success: false, status: 404, message });
});

module.exports = app;