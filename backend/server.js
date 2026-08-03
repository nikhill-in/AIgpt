import express, { Router } from "express";
import cors from "cors";
import dotenv from "dotenv";
import Routers from "./src/routes/index.router.js";
import connectMongo from "./src/config/mongo.config.js";
import cookieParser from "cookie-parser";
import errorHandler from "./src/middleware/errorHandler.middleware.js";



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
app.use(errorHandler);

process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION! Shutting down...");
  console.error(err.name, err.message);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION! Shutting down...");
  console.error(err.name, err.message);
  server.close(() => process.exit(1));
});


const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Running on ${PORT}`);
});
