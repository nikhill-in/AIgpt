import express, { Router } from "express";
import cors from "cors";
import dotenv from "dotenv";
import Routers from "./src/routes/index.router.js";
import connectMongo from "./src/config/db.connection.js";
import dns from "dns";

dotenv.config();

dns.setServers(['8.8.8.8', '8.8.4.4']); // Force Google DNS

const app = express();

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use(
  cors({
    origin: "*",
  })
);


app.use("/api", Routers);

connectMongo();

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Running on ${PORT}`);
});
