import { chatService } from "../services/aiService.js";
import Chat from "../model/chat.model.js";
import Message from "../model/message.model.js";

export const sendMessage = async (req, res) => {
  const { chatId, content, tSize } = req.body;
  console.log(content)
  const userId = req.user?.id;
  console.log(userId);
const ALLOWED_ROLES = ["admin", "pro"];

if (tSize === 2000 && !ALLOWED_ROLES.includes(req.user.role)) {
  return res.status(403).json({ success: false, message: "Not authorized for this token size" });
}
  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Please login to continue",
    });
  }

  if (!content) {
    return res.status(400).json({
      success: false,
      message: "Content is required",
    });
  }

  let chat = chatId ? await Chat.findOne({ _id: chatId, user: userId }) : null;

  if (chatId && !chat) {
    return res.status(404).json({
      success: false,
      message: "Chat not found",
    });
  }

  if (!chat) {
    chat = await Chat.create({
      user: userId,
      title: content.slice(0, 40),
    });
  }

  await Message.create({ chat: chat._id, role: "user", content });

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.write(`data: ${JSON.stringify({ chatId: chat._id })}\n\n`);

  try {
    const fullText = await chatService(
      content,
      "You are a helpful assistant.",
      (token) => {
        res.write(`data: ${JSON.stringify({ text: token })}\n\n`);
      },
      tSize
    );

    if (!fullText) {
      res.write(
        `data: ${JSON.stringify({ error: "Empty response from model" })}\n\n`,
      );
      return res.end();
    }

    await Message.create({
      chat: chat._id,
      role: "assistant",
      content: fullText,
    });
    res.write("data: [DONE]\n\n");
    res.end();
  } catch (err) {
    console.error(err);
    res.write(`data: ${JSON.stringify({ error: "Generation failed" })}\n\n`);
    res.end();
  }
};