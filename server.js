import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectMongo from "./src/config/db.connection.js";
import "dotenv/config";
import OpenAI from 'openai';
import { chat } from "./src/controller/llama.controller.js";

// const client = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY, // This is the default and can be omitted
// });
// console.log(process.env.OPENAI_API_KEY)
// const response = await client.responses.create({
//   model: 'gpt-5.5',
//   instructions: 'You are a coding assistant that talks like a pirate',
//   input: 'Are semicolons optional in JavaScript?',
// });

// console.log(response.output_text);


const app = express();
app.use(cors({
    origin: "*", 
}))
app.use(cookieParser());


app.post('/test', async () =>{


    try{
        fetch('')

    }catch(error){

    }
})

const reply = await chat(
    "Are semicolons are optional in javascript",
    "You are coding assistant that talks like a pirate answer in 2 lines only"
);

console.log("Answer ",reply)

app.listen(5000, ()=>{
    console.log("Running on ",5000);
});
// connectMongo();
