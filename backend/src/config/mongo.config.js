import mongoose from "mongoose";
import config from "./env.config.js";
import dns from "dns";



dns.setServers(['8.8.8.8', '8.8.4.4']); // Force Google DNS

const connectMongo = async () => {
  try {
    // console.log(config.mongo.uri)
    await mongoose.connect(config.mongo.uri);

    console.log("MongoDB Connected Successfully ✅");
  } catch (error) {
    console.error("MongoDB Error ❌", error);
    process.exit(1);
  }
};

connectMongo();


export default connectMongo; 