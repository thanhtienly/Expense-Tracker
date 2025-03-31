const express = require("express");
require("dotenv").config();
const app = express();
var cors = require("cors");

const { sequelize } = require("./database/config");
const PORT = process.env.PORT;

const { User } = require("./models/Users");
const { Token } = require("./models/Token");
const { Transaction } = require("./models/Transaction");
const { Label } = require("./models/Label");
const { Balance } = require("./models/Balance");
const { Wallet } = require("./models/Wallet");

const authRoute = require("./routes/auth.routes");
const transactionRoute = require("./routes/transaction.routes");
const balanceRoute = require("./routes/balance.routes");
sequelize.sync();

app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
  })
);

app.use("/auth", authRoute);
app.use("/transactions", transactionRoute);
app.use("/balance", balanceRoute);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
