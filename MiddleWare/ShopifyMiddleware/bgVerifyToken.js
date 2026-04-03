const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const bgVerifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).send("No token");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).send("Invalid token");
  }
};

module.exports = { bgVerifyToken };
