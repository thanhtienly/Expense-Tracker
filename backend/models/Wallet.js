const { DataTypes, ENUM } = require("sequelize");
const { sequelize } = require("../database/config");
const { User } = require("./Users");

const Wallet = sequelize.define(
  "Wallet",
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
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    balance: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    lastUpdatedMonth: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    lastUpdatedYear: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    createdAt: false,
    updatedAt: false,
  }
);

Wallet.belongsTo(User, {
  foreignKey: "userId",
});

module.exports = { Wallet };
