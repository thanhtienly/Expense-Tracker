require("dotenv").config();

const jwt = require("jsonwebtoken");

const generateJwtToken = (userId, userEmail) => {
  const accessToken = jwt.sign(
    {
      userId: userId,
      email: userEmail,
    },
    process.env.JWT_ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.JWT_ACCESS_TOKEN_LIFETIME,
    }
  );

  const refreshToken = jwt.sign(
    {
      userId: userId,
      email: userEmail,
    },
    process.env.JWT_REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.JWT_REFRESH_TOKEN_LIFETIME,
    }
  );

  return {
    accessToken,
    refreshToken,
  };
};

const verifyRefreshToken = (refreshToken) => {
  try {
    var user = jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET, {
      ignoreExpiration: true,
    });
  } catch (error) {
    return {
      error: 400,
      message: "Invalid Token",
    };
  }

  var tokenExpiredAt = user["exp"] * 1000;

  if (tokenExpiredAt < Date.now()) {
    /* Access Token Expired */
    return {
      error: 401,
      message: "Refresh Token expired, please login again",
    };
  }

  return { user };
};

module.exports = { generateJwtToken, verifyRefreshToken };
