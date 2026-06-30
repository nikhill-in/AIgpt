import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectMongo from "./src/config/db.connection.js";

const app = express();
app.use(cors({
    origin: "*",
}))
app.use(cookieParser());

app.listen(5000, ()=>{
    console.log("Running on ",5000);
});
connectMongo();