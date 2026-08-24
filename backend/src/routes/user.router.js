import express from "express";
import { editMessage, sendMessage } from "../controller/message.controller.js";
import {
  getChatMessages,
  Chats,
  deleteChat,
  renameChat,
  toggleChatStar,
} from "../controller/chat.controller.js";

const UserRouter = express.Router();

UserRouter.post("/send", sendMessage);
UserRouter.get("/chats", Chats);
UserRouter.get("/message/:chatId", getChatMessages);
UserRouter.post("/edit", editMessage);
UserRouter.patch("/rename/:chatId", renameChat);
UserRouter.delete("/message/:chatId", deleteChat);
UserRouter.patch("/:chatId/star",  toggleChatStar);

export default UserRouter;
