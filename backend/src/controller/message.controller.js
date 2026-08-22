import { chatService } from "../services/aiService.js";
import Chat from "../model/chat.model.js";
import Message from "../model/message.model.js";
import ApiError from "../utils/ApiError.js";
import catchAsync from "../utils/catchAsync.js";
import { getTokenSize } from "../helpers/token.helper.js";

const ALLOWED_ROLES = ["pro"];

// send controller

export const sendMessage = catchAsync(async (req, res) => {
  const { chatId, content, tSize } = req.body;
  const userId = req.user?.id;
  
  
  if (!userId) {
    throw new ApiError(401, "Please login to continue");
  }
  
  
  if (!content) {
    throw new ApiError(400, "Content is required");
  }
  
  const tokenSize = getTokenSize(tSize, req.user.role);

  let chat = chatId ? await Chat.findOne({ _id: chatId, user: userId }) : null;

  if (chatId && !chat) {
    throw new ApiError(404, "Chat not found");
  }

  if (!chat) {
    chat = await Chat.create({ user: userId, title: content });
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
      tokenSize
    );

    if (!fullText) {
      res.write(`data: ${JSON.stringify({ error: "Empty response from model" })}\n\n`);
      return res.end();
    }

    await Message.create({ chat: chat._id, role: "assistant", content: fullText });
    res.write("data: [DONE]\n\n");
    res.end();
  } catch (err) {
  console.error("AI generation error:", err);

  res.write(
    `data: ${JSON.stringify({
      error: err.message || "Generation failed",
    })}\n\n`
  );

  res.end();
}
});

// edit Controller

export const editMessage = catchAsync(async (req, res) => {
  const { messageId, content, tSize } = req.body;
  const userId = req.user?.id;
  
  if (!userId) {
    throw new ApiError(401, "Please login to continue");
  }
  
  
  if (!content?.trim()) {
    throw new ApiError(400, "Content is required");
  }
  
  const tokenSize = getTokenSize(tSize, req.user.role);

  const targetMessage = await Message.findById(messageId);
  if (!targetMessage) {
    throw new ApiError(404, "Message not found");
  }

  const chat = await Chat.findOne({ _id: targetMessage.chat, user: userId });
  if (!chat) {
    throw new ApiError(404, "Chat not found");
  }

  // Delete the edited message + everything after it (old reply, and anything beyond)
  await Message.deleteMany({
    chat: chat._id,
    createdAt: { $gte: targetMessage.createdAt },
  });

  await Message.create({ chat: chat._id, role: "user", content });

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.write(`data: ${JSON.stringify({ chatId: chat._id })}\n\n`);

  try {
    const fullText = await chatService(
      content,
      "You are a helpful assistant.",
      (token) => res.write(`data: ${JSON.stringify({ text: token })}\n\n`),
      tokenSize
    );

    if (!fullText) {
      res.write(`data: ${JSON.stringify({ error: "Empty response from model" })}\n\n`);
      return res.end();
    }

    await Message.create({ chat: chat._id, role: "assistant", content: fullText });
    res.write("data: [DONE]\n\n");
    res.end();
  } catch (err) {
  console.error("AI generation error:", err);

  res.write(
    `data: ${JSON.stringify({
      error: err.message || "Generation failed",
    })}\n\n`
  );

  res.end();
}
});
