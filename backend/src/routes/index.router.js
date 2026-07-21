import express, { Router } from "express";
import UserRouter from "./user.router.js";
import AuthRouter from "./auth.router.js";

const Routers = Router();

Routers.use('/user', UserRouter)
// Router.use('/auth', AuthRouter)


export default Routers;