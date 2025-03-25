const { Transaction } = require("../models/Transaction");

const createManyTransaction = async (transactionList) => {
  const transactions = await Transaction.bulkCreate(transactionList);

  return transactions;
};

module.exports = { createManyTransaction };
