const crypto = require("crypto");
const { Wallet } = require("../models/Wallet");
const { where } = require("sequelize");

const findBankWallet = async (userId) => {
  const data = await Wallet.findOne({
    where: {
      userId: userId,
      name: "Bank Wallet",
    },
  });

  return data;
};

const createBankWallet = async (userId) => {
  const wallet = await findBankWallet(userId);

  if (!wallet) {
    return await Wallet.create({
      id: crypto.randomUUID(),
      name: "Bank Wallet",
      userId: userId,
    });
  }

  return wallet;
};

const updateBankWalletBalance = async (
  walletId,
  walletBalance,
  lastMonth,
  lastYear,
  sqlTransaction
) => {
  return await Wallet.update(
    {
      balance: walletBalance,
      lastUpdatedMonth: lastMonth,
      lastUpdatedYear: lastYear,
    },
    {
      where: {
        id: walletId,
      },
      transaction: sqlTransaction,
    }
  );
};

module.exports = { findBankWallet, createBankWallet, updateBankWalletBalance };
