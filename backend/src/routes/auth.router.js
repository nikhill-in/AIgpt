import express, { Router } from "express";
import { getMe, login, logout, register } from "../controller/auth.controller.js";

const AuthRouter = Router();

AuthRouter.post('/register', register);
AuthRouter.post('/login', login);
AuthRouter.post('/logout', logout);
AuthRouter.get('/me', getMe);

export default AuthRouter;