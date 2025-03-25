const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/config");
const { User } = require("./Users");

const Token = sequelize.define(
  "Token",
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
    code: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    refreshToken: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    refreshTokenExpiredAt: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
  },
  {
    createdAt: false,
    updatedAt: false,
  }
);

Token.belongsTo(User, {
  foreignKey: "userId",
});

module.exports = { Token };
