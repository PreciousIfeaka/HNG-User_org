const express = require("express");
const { PrismaClient } = require("@prisma/client");
const getUserOrgs = require("../controllers/orgs.controller");
const { authenticateToken } = require("../auth");
const { body, validationResult } = require("express-validator");

const organisationRouter = express();
const prisma = new PrismaClient();

organisationRouter.get("/organisations", authenticateToken, async(req, res) => {
const userFromToken = await req.user;
  const orgData = await getUserOrgs(userFromToken);

  const orgObj = {
    status: "success",
    message: "Successfully returned user organisations",
    data: {
      organisations: [...orgData]
    }
  }
  res.status(200).json(orgObj);
});

// post request to create an organisation
const validationArray = [
  body("name").isString().withMessage("name should be a string").notEmpty().withMessage("name should not be null"),
  body("description").isString().withMessage("description should be a string")
]

organisationRouter.post("/organisations", authenticateToken, validationArray, async(req, res) => {
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

  const userFromToken = await req.user;
  const { name, description } = req.body;

  try {
    const user = await prisma.user.update({
      where: {
        email: userFromToken.email
      },
      data: {
        organisations: {
          create: {
            name,
            description,
          }
        }
      },
      include: {
        organisations: true,
      }
    });

    const orgData = user.organisations;

    const newOrg = orgData.slice(-1)[0];
    const orgObj = {
      status: "success",
      message: "Organisation created successfully",
      data: {
          orgId: newOrg.orgId, 
          name: newOrg.name, 
          description: newOrg.description
      }
    }
    return res.status(201).json(orgObj);
  } catch (err) {
    res.status(400).json({
      status: "Bad Request",
      message: "Client error",
      statusCode: 400
    })
  }
});

organisationRouter.get("/organisations/:id", authenticateToken, async (req, res) => {
  const orgid = req.params.id;
  try {
    const org = await prisma.organisation.findUnique({
      where: {
        orgId: orgid
      }
    });
    const respObj = {
      status: "success",
      message: "Successfully obtained organisation",
      data: {
        orgId: org.orgId,
        name: org.name,
        description: org.description,
      }
    }
    return res.status(200).json(respObj);
  } catch (err) {
    res.status(401).json({
      error: "Unable to get organisation"
    })
  }
});

// Adding a user to an organisation
const validArray = [
  body("userId").isString().withMessage("userId has to be a uuid string")
]
organisationRouter.post("/organisations/:orgId/users", authenticateToken, validArray,  async(req, res) => {
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
   
  const { orgId } = req.params;
  const { userId } = req.body;

  try {
    await prisma.organisation.update({
      where: {
        orgId: orgId,
      },
      data: {
        users: {
          connect: {
            userId: userId,
          }
        }
      },
    });
    const respObj = {
      status: "success",
      message: "User added to organisation successfully",
    }
    return res.status(200).json(respObj);
  } catch (err) {
    return res.status(400).json({ error: 'An error occurred while adding the user to the organisation.' });
  }
})

module.exports = organisationRouter;