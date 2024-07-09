// const { PrismaClient } = require("@prisma/client");
const express = require("express");
require("dotenv").config();
const registerRouter = require("./routers/register.router");
const userRouter = require("./routers/user.router");
const loginRouter = require("./routers/login.router");
const organisationsRouter = require("./routers/organisations.router");
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');
const PORT = process.env.SERVER_PORT;


const app = express();

app.use(express.json());

app.use("/auth", registerRouter);

app.use("/auth", loginRouter);

app.use("/api/users", userRouter);

app.use("/api", organisationsRouter);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

module.exports = app;