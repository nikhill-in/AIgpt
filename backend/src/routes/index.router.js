    import express, { Router } from "express";
    import UserRouter from "./user.router.js";
    import AuthRouter from "./auth.router.js";
    import authMiddleware from "../middleware/auth.middleware.js";

    const Routers = Router();

    Routers.use('/user',authMiddleware, UserRouter)
    Routers.use('/auth',authMiddleware, AuthRouter)


    export default Routers;