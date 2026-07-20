import  fetch  from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const GEMINI_KEY = process.env.GEMINI_API_KEY;

export async function chatService(input, instructions = "You are a helpful assistant.") {
    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/openai/chat/completions`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${GEMINI_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "gemini-2.5-flash",
                messages: [
                    { role: "system", content: instructions },
                    { role: "user", content: input },
                ],
                max_tokens: 300,
                temperature: 0.7,
            }),
        }
    );

    const data = await response.json();
    return data.choices?.[0]?.message?.content || data.error || "no response";
}



// const GEMINI_KEY = process.env.GEMINI_API_KEY; // rename the env var, don't reuse HF_TOKEN
// const MODEL = "gemini-2.5-flash"; // this is a Gemini model, not a HF-hosted one

//  export const chatService = async (input, instructions = "You are a helpful assistant.") => {
//   const response = await fetch(
//     "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions", // ← different base URL
//     {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${GEMINI_KEY}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         model: MODEL,
//         messages: [
//           { role: "system", content: instructions },
//           { role: "user", content: input },
//         ],
//         max_tokens: 300,
//         temperature: 0.7,
//       }),
//     }
//   );

//   const data = await response.json();
//   return data.choices?.[0]?.message?.content || data.error || "no response";
// }
