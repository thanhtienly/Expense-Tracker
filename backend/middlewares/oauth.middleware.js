const tokenService = require("../services/token.service");

const OAuthTokenMiddleware = async (req, res, next) => {
  const user = req["user"];

  const tokens = await tokenService.findLastTokenByUserId(user["userId"]);

  if (!tokens) {
    return res.status(400).json({
      message: "OAuth refresh token not found",
      error: 400,
    });
  }

  var { refreshToken, refreshTokenExpiredAt } = tokens;

  if (refreshTokenExpiredAt < Date.now()) {
    return res.status(401).json({
      message: "OAuth refresh token expired",
      error: 401,
    });
  }

  req["oauth-refresh-token"] = refreshToken;
  next();
};

module.exports = { OAuthTokenMiddleware };
