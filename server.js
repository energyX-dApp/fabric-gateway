import app from "./src/config/express.config.js";
import connectToMongoDB from "./src/config/mongoose.config.js";
import signIn from "./src/controllers/signIn.controller.js";
import signUp from "./src/controllers/signUp.controller.js";
import transferCredits from "./src/controllers/trade.controller.js";

app.get("/test", (req, res) => {
  res.status(200).send("Testing success");
});
connectToMongoDB();

app.post("/signup", signUp);
app.post("/signin", signIn);
app.post("/executeTrade", transferCredits);

app.listen(process.env.PORT, () => {
  console.log(`server started on port: ${process.env.PORT}`);
});
