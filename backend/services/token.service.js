const crypto = require("crypto");
const { Token } = require("../models/Token");

const findLastTokenByUserId = async (userId) => {
  const data = await Token.findOne({
    where: {
      userId: userId,
    },
    order: [["refreshTokenExpiredAt", "DESC"]],
  });

  return data;
};

const createToken = async (
  userId,
  code,
  refreshToken,
  refreshTokenExpiredAt
) => {
  const { dataValues } = await Token.create({
    id: crypto.randomUUID(),
    userId: userId,
    code: code,
    refreshToken: refreshToken,
    refreshTokenExpiredAt: refreshTokenExpiredAt,
  });
  return dataValues;
};

const deleteToken = async (refreshToken) => {
  const { dataValues } = await Token.destroy({
    where: {
      refreshToken: refreshToken,
    },
  });
  return dataValues;
};
module.exports = { findLastTokenByUserId, createToken, deleteToken };
