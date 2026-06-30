import mongoose from "mongoose";

const connectMongo = async ()=>{
    try{
        await mongoose.connect(connect.mongo.URi);

        console.log("Database connected successfully")

    }catch(error){
        console.log("Database connection failed")
        process.exit(1);
    }
};
connectMongo();

export default connectMongo;