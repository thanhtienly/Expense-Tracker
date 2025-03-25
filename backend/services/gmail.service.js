require("dotenv").config();

const markMessageAsDone = async (gmail, messageIds) => {
  var response = await gmail.users.labels.list({
    userId: "me",
  });

  var labels = response.data.labels;

  var unreadLabelId = undefined;
  var doneLabelId = undefined;

  labels.forEach((label) => {
    if (label.name == process.env.BANK_TRANSACTION_UNREAD_LABEL_NAME) {
      unreadLabelId = label.id;
    }
    if (label.name == process.env.BANK_TRANSACTION_DONE_LABEL_NAME) {
      doneLabelId = label.id;
    }
  });

  await gmail.users.messages.batchModify({
    userId: "me",
    ids: messageIds,
    requestBody: {
      addLabelIds: [doneLabelId],
      removeLabelIds: [unreadLabelId],
    },
  });
};

const collectBankTransactions = async (gmail) => {
  /* Get all messageId of message with label: timo-transactions */
  var response = await gmail.users.messages.list({
    userId: "me",
    q: "label:timo-transactions",
  });

  var messageIds = response.data.messages.map((item) => item["id"]);

  /* Get message data from messageId */
  var messageDataList = await Promise.all(
    messageIds.map((id) => {
      return gmail.users.messages.get({
        userId: "me",
        id: id,
      });
    })
  );

  var transactions = messageDataList.map((messageData) => {
    var htmlMessage = Buffer.from(
      messageData["data"]["payload"]["parts"][0]["body"]["data"],
      "base64"
    ).toString("utf8");
    return extractBankData(htmlMessage);
  });

  return {
    transactions,
    messageIds,
  };
};

const extractBankData = (htmlMessage) => {
  const moneyType = {
    tăng: "cash-in",
    giảm: "cash-out",
  };

  var transactionMessagePattern = new RegExp(
    `<p>Mô tả: ((?!\n).*)\.<\/p><\/p>`,
    "g"
  );

  var transactionMessage = transactionMessagePattern.exec(htmlMessage)[1];

  var searchPattern = new RegExp(
    "Tài khoản Spend Account vừa (tăng|giảm) ([0-9|.]+) VND vào ([0-9]{2}/[0-9]{2}/[0-9]{4} [0-9]{2}:[0-9]{2})",
    "g"
  );

  /* Extract datetime from html message */
  var matches = searchPattern.exec(htmlMessage);

  var moneyFlow = moneyType[matches[1]];
  var amount = parseInt(matches[2].split(".").join(""));
  var dateTime = matches[3];

  /* Format date to timestamp */
  var date = dateTime.split(" ")[0];
  var time = dateTime.split(" ")[1];
  date = date.split("/").reverse().join("-");

  dateTime = date + "T" + time;

  dateTime = new Date(dateTime).getTime();

  return {
    amount: amount,
    date: dateTime,
    type: moneyFlow,
    detail: transactionMessage,
  };
};

module.exports = { collectBankTransactions, markMessageAsDone };
