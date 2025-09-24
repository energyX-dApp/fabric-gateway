import User from "../schema/user.schema.js";
import Trade from "../schema/trade.schema.js";
async function transferCredits(req, res) {
  try {
    const { tradeAmount, tradeSender, tradeReceiver, description } = req.body;
    const existingTradeSender = await User.findOne({ username: tradeSender });
    if (!existingTradeSender) {
      return res.status(404).send("Sender does not exists");
    }
    const existingTradeReceiver = await User.findOne({
      username: tradeReceiver,
    });
    if (!existingTradeReceiver) {
      return res.status(404).send("Receiver does not exist");
    }

    let tradeSenderBalance = existingTradeSender.carbonCreditsBalance;
    let tradeReceiverBalance = existingTradeReceiver.carbonCreditsBalance;

    if (tradeAmount > tradeSenderBalance) {
      return res
        .status(400)
        .send(`Insufficient balance of:${tradeSender.username}`);
    }

    tradeSenderBalance -= tradeAmount;
    tradeReceiverBalance += tradeAmount;

    await existingTradeReceiver.updateOne({
      carbonCreditsBalance: tradeReceiverBalance,
    });

    await existingTradeSender.updateOne({
      carbonCreditsBalance: tradeSenderBalance,
    });

    const newTrade = new Trade({
      tradeSenderID: existingTradeSender._id,
      tradeReceiverID: existingTradeReceiver._id,
      tradeSenderUsername: existingTradeSender.username,
      tradeReceiverUsername: existingTradeReceiver.username,
      tradeAmount: tradeAmount,
      description: description,
    });

    await newTrade.save();

    return res.status(200).json({
      message: "Trade executed successfully",
      tradeID: newTrade._id,
    });
  } catch (e) {
    console.log(`Error while transferring credits:${e}`);
  }
}

export default transferCredits;
