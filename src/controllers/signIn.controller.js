import User from "../schema/user.schema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
async function signIn(req, res) {
  try {
    const { email, unhashedPassword } = req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).send("No record found, sign up first");
    } else if (existingUser) {
      const passwordIsCorrect = await bcrypt.compare(
        unhashedPassword,
        existingUser.password
      );
      if (passwordIsCorrect) {
        const jwtToken = await jwt.sign(
          { username: existingUser.username, email: email },
          process.env.JWT_SECRET
        );
        return res.status(200).json({
          message: "Sign in successfull",
          token: jwtToken,
        });
      }
    }
  } catch (e) {
    console.log(`error while signing in:${e}`);
    return res.status(500).send("Internal server error");
  }
}

export default signIn;
