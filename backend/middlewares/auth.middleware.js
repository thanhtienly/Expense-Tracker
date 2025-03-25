require("dotenv").config();
const jwt = require("jsonwebtoken");

const JWT_ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET;

const authorizedTokenMiddleware = (req, res, next) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      error: 400,
      message: "Bearer access token required",
    });
  }
  const token = authorizationHeader.split(" ")[1]; // Extract the token after "Bearer"

  jwt.verify(
    token,
    JWT_ACCESS_TOKEN_SECRET,
    {
      ignoreExpiration: true,
    },
    (err, user) => {
      /* Token can not be verify with secret (Fake token) */
      if (err) {
        return res.status(400).json({
          error: 400,
          message: "Invalid Token",
        });
      }

      var tokenExpiredAt = user["exp"] * 1000;

      if (tokenExpiredAt < Date.now()) {
        /* Access Token Expired */
        return res.status(401).json({
          error: 401,
          message: "Access Token expired, please refresh new access token",
        });
      }

      req["user"] = user;
      next();
    }
  );
};

module.exports = { authorizedTokenMiddleware };
