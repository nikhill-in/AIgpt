import express, { Router } from "express";
import { sendMessage } from "../controller/message.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const UserRouter = Router();

// UserRouter.post('/')
// UserRouter.delete('/delete')
UserRouter.post('/chat',authMiddleware, sendMessage)
// UserRouter.get('/')

export default UserRouter;