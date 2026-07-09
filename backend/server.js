import express from "express";
import cors from "cors";
import "dotenv/config";
import { chat } from "./src/controller/llama.controller.js";

// Fail fast if the token isn't loaded — better to crash on startup
// than get a silent 401 from Hugging Face three requests in.
if (!process.env.GEMINI_API_KEY) {
  throw new Error("HF_TOKEN is missing. Check your .env file.");
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
app.post("/chat", async (req, res) => {
  try {
    const { message, instructions } = req.body;

    // Validate input before burning an API call on garbage input.
    if (!message) {
      return res.status(400).json({ error: "message is required" });
    }

    const reply = await chat(message, instructions);
    return res.status(200).json({ reply });
  } catch (error) {
    // Never swallow errors silently. Log server-side, return generic
    // message client-side (don't leak stack traces to the client).
    console.error("Chat error:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Running on ${PORT}`);
});
