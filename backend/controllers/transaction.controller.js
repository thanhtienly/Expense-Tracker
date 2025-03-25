require("dotenv").config();
const { google } = require("googleapis");
const crypto = require("crypto");
const mailService = require("../services/gmail.service");
const transactionService = require("../services/transaction.service");
const { sequelize } = require("../database/config");

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

  transactions = transactions.map((transaction) => {
    return {
      ...transaction,
      userId: req["user"]["userId"],
      id: crypto.randomUUID(),
    };
  });

  let sqlTransaction = await sequelize.transaction();
  try {
    transactions = await transactionService.createManyTransaction(transactions);
    await mailService.markMessageAsDone(gmail, messageIds);
    sqlTransaction.commit();
  } catch (error) {
    sqlTransaction.rollback();
  }

  res.json({ message: "Success", data: transactions });
};

module.exports = { fetchTransactions };
