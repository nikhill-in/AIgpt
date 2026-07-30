import express, { Router } from "express";
import { sendMessage } from "../controller/message.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import { getChatMessages, getChats } from "../controller/chat.controller.js";

const UserRouter = Router();

// UserRouter.post('/')
// UserRouter.delete('/delete')
UserRouter.post('/chat', sendMessage)
UserRouter.get('/', getChatMessages)
UserRouter.get('/', getChats)

export default UserRouter;