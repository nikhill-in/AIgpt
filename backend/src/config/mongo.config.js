import mongoose from "mongoose";
import config from "./env.config.js";
import dns from "dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const connectMongo = async () => {
    try {
        await mongoose.connect(config.mongo.uri);

        console.log("MongoDB Connected Successfully ✅");
    } catch (error) {
        console.error("MongoDB Error ❌", error);
        throw error;
    }
};

export default connectMongo;