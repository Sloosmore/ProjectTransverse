require("dotenv").config();
const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.JWT_SECRET;

function getUserIdFromToken(token) {
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    console.log(decoded.sub);
    return decoded.sub; // 'sub' property contains the user ID
  } catch (err) {
    console.log("Invalid token");
    return null;
  }
}

module.exports = { getUserIdFromToken };
