const { Transaction } = require("../models/Transaction");

const createManyTransaction = async (transactionList, sqlTransaction) => {
  const transactions = await Transaction.bulkCreate(transactionList, {
    transaction: sqlTransaction,
  });

  return transactions;
};

module.exports = { createManyTransaction };
