const crypto = require("crypto");
const { User } = require("../models/Users");

const findUserByEmail = async (email) => {
  const data = await User.findOne({
    where: {
      email: email,
    },
  });
  return data;
};

const createUser = async (email, createdAt) => {
  const { dataValues } = await User.create({
    id: crypto.randomUUID(),
    email: email,
    createdAt: createdAt || Date.now(),
  });
  return dataValues;
};

module.exports = { findUserByEmail, createUser };
