// const { PrismaClient } = require("@prisma/client");
require("dotenv").config();
const cors = require("cors");
const express = require("express");
const swaggerUi = require('swagger-ui-express');
const userRouter = require("./routers/user.router");
const loginRouter = require("./routers/login.router");
const registerRouter = require("./routers/register.router");
const organisationsRouter = require("./routers/organisations.router");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger.config");


const PORT = process.env.SERVER_PORT;


const app = express();

app.use(cors());

app.use(express.json());
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/auth", registerRouter);

app.use("/auth", loginRouter);

app.use("/api/users", userRouter);

app.use("/api", organisationsRouter);

app.use("*", async (req, res) => {
  res.status(401).send({
    status: 401,
    error: "Unauthorized"
  });
});

app.use("/openapi.json", (_req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

module.exports = app;