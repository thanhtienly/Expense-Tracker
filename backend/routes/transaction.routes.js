const { Router } = require("express");
const { authorizedTokenMiddleware } = require("../middlewares/auth.middleware");
const { OAuthTokenMiddleware } = require("../middlewares/oauth.middleware");
const transactionController = require("../controllers/transaction.controller");
const router = Router();

router.get(
  "/new",
  authorizedTokenMiddleware,
  OAuthTokenMiddleware,
  transactionController.fetchTransactions
);

module.exports = router;
