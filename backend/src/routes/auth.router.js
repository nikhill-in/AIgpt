import express, { Router } from "express";
import { getMe, login, logout, register, updateUser } from "../controller/auth.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const AuthRouter = Router();

AuthRouter.post('/register', register);
AuthRouter.post('/login', login);
AuthRouter.post('/logout', logout);
AuthRouter.put('/update', authMiddleware, updateUser);
AuthRouter.get('/me',authMiddleware, getMe);

export default AuthRouter;