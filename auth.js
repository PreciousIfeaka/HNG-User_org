require("dotenv").config();
const jwt = require("jsonwebtoken");


async function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "3m" });
}

async function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({
      status: 401,
      error: "Unauthorized"
    });
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        status: 403,
        error: "Forbidden"
      });
    }
    req.user = user;
    next();
  })
}

module.exports = {
  generateAccessToken,
  authenticateToken
};