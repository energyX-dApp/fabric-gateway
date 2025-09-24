import User from "../schema/user.schema.js";
async function myProfile(req, res) {
  try {
    const username = req.user.username;
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      const userObject = {
        username: existingUser.username,
        email: existingUser.email,
        id: existingUser._id,
        carbonCreditsBalance: existingUser.carbonCreditsBalance,
      };
      return res.status(200).json({ userObject });
    } else {
      return res.status(404).send("Username not found");
    }
  } catch (e) {
    console.log(`error while fetching profile details:${e}`);
    return res.status(500).send("Internal server error");
  }
}

export default myProfile;
