const { Router } = require("express");
const AuthController = require("../controllers/auth.controller");
const {
  authorizedTokenMiddleware,
  isValidTokenWithoutExpire,
} = require("../middlewares/auth.middleware");
const router = Router();

router.get("/oauth", AuthController.generateOAuthURL);
router.post("/oauth/token", AuthController.generateToken);
router.post(
  "/validate",
  authorizedTokenMiddleware,
  AuthController.validateUser
);
router.post("/log-out", isValidTokenWithoutExpire, AuthController.logOut);
router.post("/token", AuthController.renewAccessToken);

module.exports = router;
