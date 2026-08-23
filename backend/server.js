import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import helmet from "helmet";

import Routers from "./src/routes/index.router.js";
import connectMongo from "./src/config/mongo.config.js";
import errorHandler from "./src/middleware/errorHandler.middleware.js";
import { apiLimiter } from "./src/utils/rateLimiter.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

/*
|--------------------------------------------------------------------------
| Security
|--------------------------------------------------------------------------
*/

// HTTP security headers
app.use(helmet());

// CORS
app.use(
    cors({
        origin: CLIENT_URL,
        credentials: true,
    })
);

// General API rate limit


app.use("/api", apiLimiter);

/*
|--------------------------------------------------------------------------
| Body parsing
|--------------------------------------------------------------------------
*/

app.use(
    express.json({
        limit: "10kb",
    })
);

app.use(
    express.urlencoded({
        extended: true,
        limit: "10kb",
    })
);

app.use(cookieParser());

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
*/

app.use("/api", Routers);

/*
|--------------------------------------------------------------------------
| Error Handler
|--------------------------------------------------------------------------
*/

app.use(errorHandler);

/*
|--------------------------------------------------------------------------
| Server startup
|--------------------------------------------------------------------------
*/

let server;

const startServer = async () => {
    try {
        await connectMongo();

        server = app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("SERVER STARTUP FAILED ❌");
        console.error(error);

        process.exit(1);
    }
};

/*
|--------------------------------------------------------------------------
| Process-level error handling
|--------------------------------------------------------------------------
*/

process.on("uncaughtException", (err) => {
    console.error("UNCAUGHT EXCEPTION ❌");
    console.error(err.name, err.message);
    console.error(err.stack);

    if (server) {
        server.close(() => {
            process.exit(1);
        });
    } else {
        process.exit(1);
    }
});

process.on("unhandledRejection", (err) => {
    console.error("UNHANDLED REJECTION ❌");
    console.error(err?.name, err?.message);
    console.error(err?.stack);

    if (server) {
        server.close(() => {
            process.exit(1);
        });
    } else {
        process.exit(1);
    }
});

/*
|--------------------------------------------------------------------------
| Graceful shutdown
|--------------------------------------------------------------------------
*/

const shutdown = (signal) => {
    console.log(`${signal} received. Shutting down gracefully...`);

    if (!server) {
        process.exit(0);
    }

    server.close(() => {
        console.log("HTTP server closed.");

        process.exit(0);
    });
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

startServer();