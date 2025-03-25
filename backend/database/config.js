const { Sequelize } = require("sequelize");
require("dotenv").config();

// Load environment variables
const MYSQL_HOST = process.env.MYSQL_HOST;
const MYSQL_PORT = process.env.MYSQL_PORT;
const MYSQL_USERNAME = process.env.MYSQL_USERNAME;
const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD;
const MYSQL_DATABASE = process.env.MYSQL_DATABASE;

// Define sequelize connection
const sequelize = new Sequelize(
  MYSQL_DATABASE,
  MYSQL_USERNAME,
  MYSQL_PASSWORD,
  {
    host: MYSQL_HOST,
    port: MYSQL_PORT,
    dialect: "mysql",
    dialectOptions: {
      connectTimeout: 60000,
    },
    logging: false,
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log("Connect Mysql successfully!");
  })
  .catch((err) => {
    console.error("Connect Error!", err);
  });

module.exports = { sequelize };
