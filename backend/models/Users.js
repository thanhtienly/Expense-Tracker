const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/config");
const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    createdAt: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
  },
  {
    createdAt: false,
    updatedAt: false,
  }
);

module.exports = { User };
