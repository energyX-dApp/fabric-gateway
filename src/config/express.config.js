import express from "express";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();
const app = express();
// CORS config: allow local dev and deployed UI origins
const allowedOrigins = new Set([
  "http://localhost:3000",
  "https://localhost:3000",
  "https://energyx_ui.guywithxm5.in",
  "https://energyx-api.guywithxm5.in",
  "https://energyx_api.guywithxm5.in",
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

