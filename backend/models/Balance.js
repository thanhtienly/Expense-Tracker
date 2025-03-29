const { DataTypes, ENUM } = require("sequelize");
const { sequelize } = require("../database/config");
const { User } = require("./Users");
const { Wallet } = require("./Wallet");

const Balance = sequelize.define(
  "Balance",
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    walletId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    amount: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    month: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    createdAt: false,
    updatedAt: false,
  }
);

Balance.belongsTo(User, {
  foreignKey: "userId",
});

Balance.belongsTo(Wallet, {
  foreignKey: "walletId",
});

module.exports = { Balance };
