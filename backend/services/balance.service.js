const crypto = require("crypto");
const { Balance } = require("../models/Balance");

const findUserBalanceByMonthYear = async (walletId, month, year) => {
  const balance = await Balance.findOne({
    where: {
      walletId: walletId,
      month: month,
      year: year,
    },
  });

  return balance;
};

const upsert = async (
  userId,
  walletId,
  month,
  year,
  amount,
  sqlTransaction
) => {
  const balance = await findUserBalanceByMonthYear(walletId, month, year);

  if (!balance) {
    return await Balance.create(
      {
        id: crypto.randomUUID(),
        userId: userId,
        walletId: walletId,
        amount: amount,
        month: month,
        year: year,
      },
      { transaction: sqlTransaction }
    );
  }

  return await Balance.update(
    {
      amount: balance.amount + amount,
    },
    {
      where: {
        walletId: walletId,
        month: month,
        year: year,
      },
      transaction: sqlTransaction,
    }
  );
};

const getMonthlyBalance = async (walletId, sqlTransaction) => {
  const monthlyBalance = await Balance.findAll({
    where: {
      walletId: walletId,
    },
    order: [
      ["year", "DESC"],
      ["month", "DESC"],
    ],
    transaction: sqlTransaction,
    lock: true,
    skipLocked: true,
  });

  return monthlyBalance;
};

module.exports = { upsert, getMonthlyBalance };
