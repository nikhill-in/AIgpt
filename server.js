import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
app.use(cors({
    origin: "*",
}))
app.use(cookieParser());

app.listen(5000, ()=>{
    console.log("Running on ",5000);
});