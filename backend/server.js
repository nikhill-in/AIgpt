import express, { Router } from "express";
import cors from "cors";
import dotenv from "dotenv";
import Routers from "./src/routes/index.router.js";
import connectMongo from "./src/config/mongo.config.js";
import cookieParser from "cookie-parser";



dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));


app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, // ADD THIS — required for cookies to work
  })
);
app.use("/api", Routers);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Running on ${PORT}`);
});
