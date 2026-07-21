import express, { Router } from "express";
import cors from "cors";
import "dotenv/config";
import Routers from "./src/routes/index.router.js";

// Fail fast if the token isn't loaded — better to crash on startup
// than get a silent 401 from Hugging Face three requests in.
if (!process.env.GEMINI_API_KEY) {
  throw new Error("API Key is missing. Check your .env file.");
}

const app = express();

// Body parser — you were missing this entirely. Without it,
// req.body is undefined for any POST request with a JSON payload.
app.use(express.json());

// CORS wide open for local dev only. Lock this to your actual
// frontend origin (e.g. "http://localhost:5173") before deploying.
app.use(
  cors({
    origin: "*",
  })
);

// POST /chat — takes a user message, optionally a system instruction,
// calls the LLM, returns the reply as JSON.

app.use("/api", Routers);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Running on ${PORT}`);
});
