const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
const { generateAccessToken } = require("../auth");
require("dotenv").config();

const prisma = new PrismaClient();

const registerRouter = express();

const ValidationArray = [
  body("firstName").isString().withMessage("firstName must be a string").notEmpty().withMessage("First name must not be null"),
  body("lastName").isString().withMessage("lastName must be a string").notEmpty().withMessage("Last name must not be null"),
  body("email").isEmail().withMessage("Email must be unique and valid").notEmpty().withMessage("Email must not be null"),
  body("password").isString().withMessage("The password must be a string").notEmpty().withMessage("Password must not be null"),
  body("phone").isString().withMessage("Phone must be a string")
]

registerRouter.post("/register", ValidationArray, async (req, res) => {
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

  // hashing the password
  const { firstName, lastName, email, password, phone } = req.body;

  const findUser = await prisma.user.findUnique({
    where: {
      email: email
    }
  });

  if (findUser) {
    return res.status(422).json({
      statusCode: 422,
      message: "User already exists"
    })
  }
  
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);

  const accessToken = await generateAccessToken({email: email});

  // Adding the validated data with hashed password to the database
  try {
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        phone,
        organisations: {
          create: {
            name: `${firstName}'s Organisation`
          }
        }
      },
      include: {
        organisations: true
      }
    });
    const respObj = {
      status: "success",
      message: "Registration successful",
      data: {
        accessToken: accessToken,
        user: {
          userId: user.userId,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
        }
      }
  }
    return await res.status(201).json(respObj);
  } catch (err) {
    return await res.status(400).json({
      status: "Bad request",
      message: "Registration unsuccessful",
      statusCode: 400
    })
  }
});

module.exports = registerRouter;