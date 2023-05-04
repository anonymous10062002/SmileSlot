const jwt = require("jsonwebtoken");
require("dotenv").config();

const adminAuth = (req, res, next) => {
  let accessToken = req.headers.authorization;
  try {
    if (accessToken) {
      jwt.verify(accessToken, process.env.adminKey, (err, decoded) => {
        if (decoded.role === "admin") {
          next();
        } else {
          res.status(401).send("You are not authorized..!");
        }
      });
    } else {
      res.status(401).send("Invalid Token..!!");
    }
  } catch {
    res.status(401).send("Something Went Wrong..!!");
  }
};

module.exports = { adminAuth };
