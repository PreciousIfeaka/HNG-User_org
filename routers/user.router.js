const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { authenticateToken } = require("../auth");

const prisma = new PrismaClient();

const userRouter = express();

userRouter.get("/:id", authenticateToken, async (req, res) => {
  const userid = req.params.id;

  try {
    // Extract user data from token
    const userFromToken = req.user;

    // Find the user and return the organisations
    const userWithOrganisations = await prisma.user.findUnique({
      where: {
        userId: userid,
      },
      include: {
        organisations: true
      }
    });

    if (!userWithOrganisations) {
      return res.status(404).json({
        status: "error",
        message: "User not found"
      });
    }

    // Organisations id of the orgs the user is a member of
    const orgsId = userWithOrganisations.organisations.map((org) => org.orgId);

    // get my profile and organisations
    const myData = await prisma.user.findUnique({
      where: {email: userFromToken.email},
      include: {
        organisations: true
      }
    });

    // get my orgs Ids
    const myOrgsIds = myData.organisations.map((org) => org.orgId);

    // Find common orgs Ids
    const commonOrgsIds = orgsId.filter(orgId => myOrgsIds.includes(orgId));

    if (commonOrgsIds) {
      const userObj = {
        status: "success",
        message: "List of user data",
        data: {
          userId: userid,
          firstName: userWithOrganisations.firstName,
          lastName: userWithOrganisations.lastName,
          email: userWithOrganisations.email,
          phone: userWithOrganisations.phone
        }
      }
      return res.status(200).json(userObj);
    } else {
      return res.status(404).json({
        status: "Forbiddden",
        message: "Not Authorized"
      })
    }
  } catch (err) {
    return ({ error: true, message: "Error fetching users in the same orgs" })
  }
});

module.exports = userRouter;