import Chat from "../model/chat.model.js";
import Message from "../model/message.model.js";

export const getChats = async (req, res) => {
  const chats = await Chat.find({ user: req.user._id }).sort({ updatedAt: -1 });
  res.json(chats);
};

export const getChatMessages = async (req, res) => {
  const chat = await Chat.findOne({ _id: req.params.chatId, user: req.user._id });

  if (!chat) {
    return res.status(404).json({ success: false, message: "Chat not found" });
  }

  const messages = await Message.find({ chat: chat._id }).sort({ createdAt: 1 });
  res.json(messages);
};