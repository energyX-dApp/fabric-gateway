import User from "../schema/user.schema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

async function signUp(req, res) {
  try {
    const { username, unhashedPassword, email } = req.body;
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });

    if (existingUser) {
      if (existingUser.username == username) {
        return res.status(400).send("Username is already taken");
      } else if (existingUser.email == email) {
        return res
          .status(400)
          .send("Email is already linked to another account");
      }
    }

    const hashedPassword = await bcrypt.hash(unhashedPassword, 10);

    const newUser = new User({
      username: username,
      password: hashedPassword,
      email: email,
    });
    const jwtToken = jwt.sign(
      { username: username, email: email },
      process.env.JWT_SECRET
    );

    await newUser.save();
    return res.status(201).json({
      message: "User added successfully",
      token: jwtToken,
    });
  } catch (e) {
    console.log(`error while signing up: ${e}`);
    return res.status(500).send("Internal server error");
  }
}

export default signUp;
