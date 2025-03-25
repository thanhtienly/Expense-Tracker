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

const authRoute = require("./routes/auth.routes");
const transactionRoute = require("./routes/transaction.routes");
sequelize.sync();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.use("/auth", authRoute);
app.use("/transactions", transactionRoute);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
