import express, { Router } from "express";
import { chat } from "../controller/chat.controller.js";

const UserRouter = Router();

UserRouter.post('/')
UserRouter.delete('/delete')
UserRouter.put('/chat', chat )
UserRouter.get('/')

export default UserRouter;