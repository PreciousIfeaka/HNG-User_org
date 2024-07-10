// const { PrismaClient } = require("@prisma/client");
require("dotenv").config();
const cors = require("cors");
const express = require("express");
const swaggerUi = require('swagger-ui-express');
const userRouter = require("./routers/user.router");
const loginRouter = require("./routers/login.router");
const registerRouter = require("./routers/register.router");
const organisationsRouter = require("./routers/organisations.router");


const PORT = process.env.SERVER_PORT;


const app = express();

app.use(cors());

app.use(express.json());

app.use("/auth", registerRouter);

app.use("/auth", loginRouter);

app.use("/api/users", userRouter);

app.use("/api", organisationsRouter);

const CSS_URL =
  "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css";

const swaggerDocument = require("./swagger-output.json");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument, { customCssUrl: CSS_URL }));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

module.exports = app;