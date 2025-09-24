import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    carbonCreditsBalance: {
      type: Number,
      default: 100,
    },
    mspName: {
      type: String,
    },
    //TODO: imclude msp-name and fabric-ca-name in schema
  },
  { timestamps: true }
);

const User = new mongoose.model("User", userSchema);
export default User;
