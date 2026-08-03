import Chat from "../model/chat.model.js";
import Message from "../model/message.model.js";
import ApiError from "../utils/apiError.js";
import catchAsync from "../utils/catchAsync.js";

export const getChats = catchAsync(async (req, res) => {
  const chats = await Chat.find({ user: req.user.id }).sort({ updatedAt: -1 });
  res.json(chats);
});

export const getChatMessages = catchAsync(async (req, res) => {
  const chat = await Chat.findOne({ _id: req.params.chatId, user: req.user.id });

  if (!chat) {
    throw new ApiError(404, "Chat not found");
  }

  const messages = await Message.find({ chat: chat._id }).sort({ createdAt: 1 });
  res.json(messages);
});

export const deleteChat = catchAsync(async(req,res)=>{
  const chat = await Chat.findOne({_id: req.params.chatId});

  if (!chat) {
    throw new ApiError(404, "Chat not found");
  }

  const chats = await Chat.deleteOne({_id: req.params.chatId})
})