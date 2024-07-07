const express = require("express");
const bcrypt = require("bcrypt");
const { body, validationResult } = require("express-validator");
const { PrismaClient } = require("@prisma/client");
require("dotenv").config();
const { generateAccessToken } = require("../auth");


const loginRouter = express();
const prisma = new PrismaClient();

const validationArray = [
  body("email").notEmpty().withMessage("Email must not be null").isEmail().withMessage("Email must be unique and valid"),
  body("password").notEmpty().withMessage("Password must not be null").isString().withMessage("The password must be a string")
]

loginRouter.post("/login", validationArray, async (req, res) => {
  // input validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }

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