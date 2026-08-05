import express, { Router } from "express";
import { editMessage, sendMessage } from "../controller/message.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import { getChatMessages, Chats, deleteChat } from "../controller/chat.controller.js";

const UserRouter = Router();

// UserRouter.post('/')
UserRouter.post('/send', sendMessage)
UserRouter.get('/chats', Chats)
UserRouter.get('/message/:chatId', getChatMessages)
UserRouter.post('/edit', editMessage );
UserRouter.delete('/message/:chatId', deleteChat)

export default UserRouter;