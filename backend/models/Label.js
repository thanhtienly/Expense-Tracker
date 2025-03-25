const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/config");

const Label = sequelize.define(
  "Label",
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    createdAt: false,
    updatedAt: false,
  }
);

module.exports = { Label };
