require("dotenv").config();
const walletService = require("../services/wallet.service");
const balanceService = require("../services/balance.service");

const getBankWalletBalance = async (req, res) => {
  const userId = req["user"]["userId"];
  const wallet = await walletService.findBankWallet(userId);

  if (!wallet) {
    return res.json({
      message: "Success",
      data: {
        currentBalance: 0,
        previousBalance: 0,
      },
    });
  }

  const currentMonthBalance = await balanceService.findUserBalanceByMonthYear(
    wallet["id"],
    wallet["lastUpdatedMonth"],
    wallet["lastUpdatedYear"]
  );

  const thisMonthBalance = wallet["balance"];
  const previousMonthBalance =
    thisMonthBalance -
    (currentMonthBalance["cashIn"] - currentMonthBalance["cashOut"]);
  res.json({
    message: "Success",
    data: {
      currentBalance: thisMonthBalance,
      previousBalance: previousMonthBalance,
    },
  });
};

module.exports = { getBankWalletBalance };
