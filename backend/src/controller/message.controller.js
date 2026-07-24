// controllers/messageController.js
import Chat from "../models/Chat.js";
import Message from "../models/Message.js";
import { chatService } from "../services/aiService.js";

export const sendMessage = async (req, res) => {
  const { chatId, content } = req.body;

  let chat = chatId ? await Chat.findById(chatId) : null;
  if (!chat) {
    chat = await Chat.create({
      user: req.user._id,
      title: content.slice(0, 40), // simple auto-title from first message
    });
  }

  // save user message immediately
  await Message.create({ chat: chat._id, role: "user", content });

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.write(`data: ${JSON.stringify({ chatId: chat._id })}\n\n`); // send chatId first for new chats

  const fullText = await chatService(content, "You are a helpful assistant.", (token) => {
    res.write(`data: ${JSON.stringify({ text: token })}\n\n`);
  });

  // save assistant reply once streaming is done
  await Message.create({ chat: chat._id, role: "assistant", content: fullText });

  res.write("data: [DONE]\n\n");
  res.end();
};