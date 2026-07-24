import mongoose from "mongoose";

const connectMongo = async () => {
  try {
    // console.log("URI: ", process.env.MONGO_URI);
    await mongoose.connect(
      process.env.MONGO_URI
    );
    console.log("Database connected successfully");
  } catch (error) {
   
    console.error("Database connection failed:");
    console.error(error);
    process.exit(1);

  }
};
// connectMongo();

export default connectMongo;
