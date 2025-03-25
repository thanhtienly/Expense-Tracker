const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/config");
const { User } = require("./Users");
const { Label } = require("./Label");

const Transaction = sequelize.define(
  "Transaction",
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
    date: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    detail: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    type: {
      type: DataTypes.ENUM(["cash-in", "cash-out"]),
      allowNull: false,
    },
    labelId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
  },
  {
    createdAt: false,
    updatedAt: false,
  }
);

Transaction.belongsTo(User, {
  foreignKey: "userId",
});

Transaction.belongsTo(Label, {
  foreignKey: "labelId",
});

module.exports = { Transaction };
