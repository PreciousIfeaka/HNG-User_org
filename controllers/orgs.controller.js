const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient()
async function getUserOrgs(user) {
  const userOrgs = await prisma.user.findUnique({
    where: {
      email: user.email,
    },
    include: {
      organisations: true,
    }
  });
  return userOrgs.organisations;
}

module.exports = getUserOrgs;