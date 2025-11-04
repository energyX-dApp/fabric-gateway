// server.js
import("dotenv/config"); // Load .env automatically
import app from "./src/config/express.config.js";
import connectToMongoDB from "./src/config/mongoose.config.js";
import healthRoutes from "./src/routes/health.js";
import allowanceRoutes from "./src/routes/allowances.js";
import govRoutes from "./src/routes/gov.js";
import signIn from "./src/controllers/signIn.controller.js";
import signUp from "./src/controllers/signUp.controller.js";
// import transferCredits from "./src/controllers/trade.controller.js";
import myProfile from "./src/controllers/myProfile.controller.js";
import verifyJWT from "./src/middlewares/jwt.middleware.js";
import searchUser from "./src/controllers/searchUser.controller.js";
import { PORT, CHANNEL, CHAINCODE } from "./src/config.js";

// Connect to MongoDB
connectToMongoDB();

// Test route
app.get("/test", (req, res) => {
  res.status(200).send("Testing success");
});

// Register existing routes
app.use("/", healthRoutes);
app.use("/allowances", allowanceRoutes);
app.use("/gov", govRoutes);

// Register energyX routes
app.post("/signup", signUp);
app.post("/signin", signIn);
// app.post("/executeTrade", verifyJWT, transferCredits);
app.get("/myProfile", verifyJWT, myProfile);
app.get("/searchUser", searchUser);

app.listen(PORT, () => {
  console.log(
    `co2-api running on http://localhost:${PORT} | channel=${CHANNEL} | chaincode=${CHAINCODE}`
  );
});
