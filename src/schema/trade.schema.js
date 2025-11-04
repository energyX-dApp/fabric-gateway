import mongoose from "mongoose";

const tradeSchema = new mongoose.Schema(
  {
    tradeSenderID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tradeReceiverID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tradeSenderUsername: {
      type: String,
      required: true,
    },
    tradeReceiverUsername: {
      type: String,
      required: true,
    },
    tradeAmount: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const Trade = new mongoose.model("Trade", tradeSchema);
export default Trade;

