import express from "express";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();
const app = express();
// CORS config: allow local dev and deployed UI origins
const allowedOrigins = new Set([
  "*"
]);

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true); // curl/postman
      try {
        const ok = allowedOrigins.has(origin);
        return cb(ok ? null : new Error("CORS blocked"), ok);
      } catch (_) {
        return cb(new Error("CORS check failed"));
      }
    },
    credentials: true,
    allowedHeaders: [
      "Authorization",
      "Content-Type",
      "x-org",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  })
);
app.options("*", cors());
app.use(express.json());
export default app;

