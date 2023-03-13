const jwt = require("jsonwebtoken");
require("dotenv").config();

function verifyToken(req, res, next) {
  const token = req.headers["x-access-token"];
  if (!token) {
    return res.status(401).json({
      auth: false,
      message: "No token provided",
    });
  }
  const decoded = jwt.verify(token, process.env.USER_SECRETKEY);
  req.userId = decoded.id;
  next();
}

module.exports = verifyToken;
