import Chat from "../model/chat.model.js";
import Message from "../model/message.model.js";
import ApiError from "../utils/ApiError.js";
import catchAsync from "../utils/catchAsync.js";

// get All chats ==============

export const Chats = catchAsync(async (req, res) => {
  const chats = await Chat.find({ user: req.user.id }).sort({ updatedAt: -1 });
  res.status(200).json({ success: true, message: "Done..", chats });
});

// get Chat messages==============

export const getChatMessages = catchAsync(async (req, res) => {
  const chat = await Chat.findOne({
    _id: req.params.chatId,
    user: req.user.id,
  });

  if (!chat) {
    throw new ApiError(404, "Chat not found");
  }

  const messages = await Message.find({ chat: chat._id }).sort({
    createdAt: 1,
  });
  res.status(200).json({ success: true, message: "Done..", messages });
});

// delete chat====================
export const deleteChat = catchAsync(async (req, res) => {
  console.log("on delete ", req.params.chatId);
  const chat = await Chat.findOne({
    _id: req.params.chatId,
    user: req.user.id,
  }); // missing user filter — IDOR again

  if (!chat) {
    throw new ApiError(404, "Chat not found");
  }

  await Chat.deleteOne({ _id: chat._id });
  await Message.deleteMany({ chat: chat._id }); // orphaned messages otherwise — never deleted

  res.json({ success: true, message: "Chat deleted" }); // no response was being sent at all
});

// rename chat===========
export const renameChat = catchAsync(async (req, res) => {
  const { title } = req.body;

  if (!title?.trim()) {
    throw new ApiError(400, "Title is required");
  }

  const chat = await Chat.findOneAndUpdate(
    { _id: req.params.chatId, user: req.user.id },
    { title: title.trim() },
    { new: true },
  );

  if (!chat) {
    throw new ApiError(404, "Chat not found");
  }

  res
    .status(200)
    .json({ success: true, message: "Chat Rename Successfull..", chat });
});

// get usage state======================

export const getUsageStats = catchAsync(async (req, res) => {
  const [chatCount, messageCount] = await Promise.all([
    Chat.countDocuments({ user: req.user.id }),
    Message.countDocuments({
      chat: { $in: await Chat.find({ user: req.user.id }).distinct("_id") },
    }),
  ]);

  res
    .status(200)
    .json({ success: true, message: "Done..", chatCount, messageCount });
});

// get chats with pagination=============

export const getChats = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const [chats, total] = await Promise.all([
    Chat.find({ user: req.user.id })
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit),
    Chat.countDocuments({ user: req.user.id }),
  ]);

  res
    .status(200)
    .json({
      success: true,
      message: "Done..",
      chats,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
});

// toggle chat ===========
export const toggleChatStar = catchAsync(async (req, res) => {
  console.log("hi wanna touch..")
  const { chatId } = req.params;
  const userId = req.user.id;

  const chat = await Chat.findOne({
    _id: chatId,
    user: userId,
  });

  if (!chat) {
    throw new ApiError(404, "Chat not found");
  }

  chat.starred = !chat.starred;
  await chat.save();

  res.status(200).json({
    status: true,
    starred: chat.starred,
  });
});