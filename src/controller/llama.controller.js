const HF_TOKEN = process.env.HF_TOKEN;
const MODEL = "meta-llama/Meta-Llama-3-8B-Instruct";

export async function chat(input, instructions = "You are a helpful assistant.") {
  const response = await fetch(
    "https://router.huggingface.co/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HF_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
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