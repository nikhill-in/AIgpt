import { chatService } from "../service/chat.service.js";

export const chat = async (req, res) => {
  try {
    const { message, instructions } = req.body;

    // Validate input before burning an API call on garbage input.
    if (!message) {
      return res.status(400).json({ error: "message is required" });
    }

    const reply = await chatService(message, instructions);
    return res.status(200).json({ reply });
  } catch (error) {
    // Never swallow errors silently. Log server-side, return generic
    // message client-side (don't leak stack traces to the client).
    console.error("Chat error:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};