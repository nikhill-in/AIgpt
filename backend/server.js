import express, { Router } from "express";
import cors from "cors";
import dotenv from "dotenv";
import Routers from "./src/routes/index.router.js";
import connectMongo from "./src/config/mongo.config.js";



dotenv.config();

const app = express();

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use(
  cors({
    origin: "*",
  })
);

app.use("/api", Routers);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Running on ${PORT}`);
});
