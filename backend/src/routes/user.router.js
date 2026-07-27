import express, { Router } from "express";
import { sendMessage } from "../controller/message.controller.js";

const UserRouter = Router();

// UserRouter.post('/')
// UserRouter.delete('/delete')
UserRouter.post('/chat', sendMessage)
// UserRouter.get('/')

export default UserRouter;