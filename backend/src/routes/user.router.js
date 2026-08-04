import express, { Router } from "express";
import { editMessage, sendMessage } from "../controller/message.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import { getChatMessages, Chats } from "../controller/chat.controller.js";

const UserRouter = Router();

// UserRouter.post('/')
// UserRouter.delete('/delete')
UserRouter.post('/send', sendMessage)
UserRouter.get('/message/:chatId', getChatMessages)
UserRouter.get('/chats', Chats)
UserRouter.post('/edit', editMessage);

export default UserRouter;