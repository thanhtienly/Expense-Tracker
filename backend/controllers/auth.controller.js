require("dotenv").config();
const { google } = require("googleapis");

const jwtService = require("../services/jwt.service");
const userService = require("../services/user.service");
const tokenService = require("../services/token.service");
const { sequelize } = require("../database/config");

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.CALLBACK_URL
);
// generate a url that asks permissions for read only gmail message
const scopes = [
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/gmail.modify",
];

const generateOAuthURL = (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
    response_type: "code",
    state: "state_parameter_passthrough_value",
    include_granted_scopes: true,
  });

  res.json({ message: "Success", data: url });
};

const generateToken = async (req, res) => {
  var code = req.body?.code;

  /* If user not send code, return error  */
  if (!code) {
    return res.status(400).json({
      message: "Request body must have code field",
      error: 400,
    });
  }

  /* Get Token from Google OAuth */
  try {
    var { tokens } = await oauth2Client.getToken(code);

    var { refresh_token, refresh_token_expires_in, id_token } = tokens;

    var refresh_token_expires_at = Date.now() + 1000 * refresh_token_expires_in;
    const userInfo = JSON.parse(
      Buffer.from(id_token.split(".")[1], "base64").toString()
    );

    var { email } = userInfo;
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: "Invalid code",
      error: 400,
    });
  }

  if (!refresh_token) {
    return res.status(400).json({
      message: "Code have been used. Please log out, then log in again",
      error: 400,
    });
  }

  try {
    /* Create user if user with the email is not exist */
    var user = await userService.findUserByEmail(email);

    if (!user) {
      user = await userService.createUser(email, Date.now());
    }

    /* Save user's token to database for use later */
    await tokenService.createToken(
      user["id"],
      code,
      refresh_token,
      refresh_token_expires_at
    );
  } catch (error) {
    /* Create record in DB error, revoke user */
    console.log(error);
  }

  /* Generate JWT to return to the user */
  const { accessToken, refreshToken } = jwtService.generateJwtToken(
    user["id"],
    user["email"]
  );

  console.log({
    accessToken: accessToken,
    refreshToken: refreshToken,
  });

  res.json({
    message: "Success",
    data: {
      accessToken: accessToken,
      refreshToken: refreshToken,
    },
  });
};

const validateUser = async (req, res) => {
  res.status(200).json({ message: "Success" });
};

const renewAccessToken = async (req, res) => {
  var refreshToken = req.body?.refreshToken;
  if (!refreshToken) {
    return res.status(400).json({
      message: "Missing Refresh Token",
      error: 400,
    });
  }

  const { error, user, message } = jwtService.verifyRefreshToken(refreshToken);

  if (error) {
    return res.status(error).json({
      message: message,
      error: error,
    });
  }

  var { accessToken, refreshToken } = jwtService.generateJwtToken(
    user["userId"],
    user["email"]
  );

  console.log({
    accessToken: accessToken,
    refreshToken: refreshToken,
  });
  res.json({
    message: "Success",
    data: {
      accessToken: accessToken,
      refreshToken: refreshToken,
    },
  });
};

const logOut = async (req, res) => {
  const user = req["user"];
  const { refreshToken } = await tokenService.findLastTokenByUserId(
    user["userId"]
  );

  try {
    oauth2Client.revokeToken(refreshToken);
    var tokens = await tokenService.deleteToken(refreshToken);
  } catch (error) {
    console.log("Invalid OAuth Refresh Token");
  }

  res.json({ message: "Logout successfully", data: refreshToken });
};

module.exports = {
  generateOAuthURL,
  generateToken,
  validateUser,
  renewAccessToken,
  logOut,
};
