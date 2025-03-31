const { Router } = require("express");
const { authorizedTokenMiddleware } = require("../middlewares/auth.middleware");
const balanceController = require("../controllers/balance.controller");

const router = Router();

router.get(
  "/wallet/bank",
  authorizedTokenMiddleware,
  balanceController.getBankWalletBalance
);

module.exports = router;
