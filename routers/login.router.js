const express = require("express");
const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");
require("dotenv").config();
const { generateAccessToken } = require("../auth");


const loginRouter = express();
const prisma = new PrismaClient();

loginRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const findUser = await prisma.user.findUnique({
      where: {
        email: email
      }
    });
    if (!findUser) {
      return res.status(401).json({
        "status": "Bad request",
        "message": "Authentication failed",
        "statusCode": 401
      });
    }

    // password comaprison
    const matchedPassword = await bcrypt.compare(password, findUser.password);

    if (!matchedPassword) {
      return res.status(401).json({
        "status": "Bad request",
        "message": "Authentication failed",
        "statusCode": 401
      });
    }
    // generate access token
    const accessToken = await generateAccessToken({email: findUser.email});
    
    // create a response object
    const respObj = {
      status: "success",
      message: "Login successful",
      data: {
        accessToken: accessToken,
        user: {
          userId: findUser.userId,
          firstName: findUser.firstName,
          lastName: findUser.lastName,
          email: findUser.email,
          phone: findUser.phone,
        }
      }
    };
    return res.status(200).json(respObj);
  } catch (err) {
    return res.status(401).json({
      "status": "Bad request",
      "message": "Authentication failed",
      "statusCode": 401
    })
  }
});

module.exports = loginRouter;