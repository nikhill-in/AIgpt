import Chat from "../model/chat.model.js";
import Message from "../model/message.model.js";

export const getChats = async (req, res) => {
  const chats = await Chat.find({ user: req.user._id }).sort({ updatedAt: -1 });
  res.json(chats);
};

export const getChatMessages = async (req, res) => {
  const messages = await Message.find({ chat: req.params.chatId }).sort({ createdAt: 1 });
  res.json(messages);
};