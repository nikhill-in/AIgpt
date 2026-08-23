import express, { Router } from "express";
import { getMe, getTokenOptions, login, logout, register, updateUser } from "../controller/auth.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import { authLimiter } from "../utils/rateLimiter.js";

const AuthRouter = Router();

AuthRouter.post('/register',authLimiter, register);
AuthRouter.post('/login',authLimiter, login);
AuthRouter.post('/logout', authLimiter, logout);

AuthRouter.put('/update', authMiddleware, updateUser);
AuthRouter.get('/me',authMiddleware, getMe);
AuthRouter.get('/token-options', authMiddleware, getTokenOptions);

export default AuthRouter;