import User from "../schema/user.schema.js";
async function searchUser(req, res) {
  try {
    const queryUsername = req.query.q;
    const foundUsernames = await User.find(
      {
        username: { $regex: queryUsername, $options: "i" },
      },
      "-password, -carbonCreditsBalance"
    );
    // foundUsernames ek array return kar rha hai, thats why .length prop is 0 ==> No matching results
    if (foundUsernames.length == 0) {
      return res.status(404).send("No username found");
    } else if (foundUsernames.length >= 1) {
      return res.status(200).json({ foundUsernames });
    }
  } catch (e) {
    console.log(`error while searching username:${e}`);
    return res.status(500).send("Internal server error");
  }
}

export default searchUser;

