require("dotenv").config();
const { google } = require("googleapis");
const crypto = require("crypto");
const mailService = require("../services/gmail.service");
const transactionService = require("../services/transaction.service");
const { sequelize } = require("../database/config");
const walletService = require("../services/wallet.service");
const balanceService = require("../services/balance.service");

const oauth2Client = new google.auth.OAuth2({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
});

const fetchTransactions = async (req, res) => {
  const refreshToken = req["oauth-refresh-token"];

  const newToken = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  }).then((res) => res.json());

  oauth2Client.setCredentials({
    access_token: newToken["access_token"],
    refresh_token: refreshToken,
  });

  const gmail = google.gmail({ auth: oauth2Client, version: "v1" });

  var { transactions, messageIds } = await mailService.collectBankTransactions(
    gmail
  );

  var userId = req["user"]["userId"];

  /* Add transactionId to transactions data */
  transactions = transactions.map((transaction) => {
    return {
      ...transaction,
      userId: userId,
      id: crypto.randomUUID(),
    };
  });

  /* Calculate monthly balance cashIn, cashOut */
  var balanceDict = {};
  transactions.forEach((transaction) => {
    var month = new Date(transaction["date"]).getMonth() + 1;
    var year = new Date(transaction["date"]).getFullYear();
    var key = `${month}.${year}`;

    if (!balanceDict[key]) {
      balanceDict[key] = {
        month: month,
        year: year,
        cashIn: 0,
        cashOut: 0,
      };
    }

    if (transaction["type"] == "cash-in") {
      balanceDict[key]["cashIn"] += transaction["amount"];
    } else if (transaction["type"] == "cash-out") {
      balanceDict[key]["cashOut"] += transaction["amount"];
    }
  });

  var balanceChangedArray = Object.values(balanceDict);

  /* Create user's wallet if not exist */
  var wallet = await walletService.createBankWallet(userId);

  let sqlTransaction = await sequelize.transaction();

  try {
    /* Insert new transaction */
    transactions = await transactionService.createManyTransaction(
      transactions,
      sqlTransaction
    );

    /* Update or Create monthly balance */
    await Promise.all(
      balanceChangedArray.map((balanceChanged) => {
        return balanceService.upsert(
          userId,
          wallet["id"],
          balanceChanged["month"],
          balanceChanged["year"],
          balanceChanged["cashIn"],
          balanceChanged["cashOut"],
          sqlTransaction
        );
      })
    );

    /* Calculate user's wallet balance from monthly balance */
    const monthlyBalance = await balanceService.getMonthlyBalance(
      wallet["id"],
      sqlTransaction
    );

    var total = 0;
    var lastUpdatedMonth = monthlyBalance[0]["month"];
    var lastUpdatedYear = monthlyBalance[0]["year"];

    monthlyBalance.forEach((balance) => {
      total += balance["cashIn"] - balance["cashOut"];
    });

    /* Update user's wallet balance */
    await walletService.updateBankWalletBalance(
      wallet["id"],
      total,
      lastUpdatedMonth,
      lastUpdatedYear,
      sqlTransaction
    );

    /* Mark email message as read */
    await mailService.markMessageAsDone(gmail, messageIds);

    sqlTransaction.commit();
  } catch (error) {
    console.log(error);
    sqlTransaction.rollback();
  }

  // await mailService.markMessageAsDone(gmail, messageIds);

  // console.log("Mark Message As Done Successfully");

  res.json({ message: "Success", data: transactions });
};

module.exports = { fetchTransactions };
