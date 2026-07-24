export async function chatService(input, instructions, onChunk) {
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
        stream: true,
        max_tokens: 500,
        temperature: 0.7,
      }),
    }
  );

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let fullText = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const lines = decoder.decode(value).split("\n").filter(l => l.startsWith("data: "));
    for (const line of lines) {
      const payload = line.replace("data: ", "");
      if (payload === "[DONE]") continue;
      const json = JSON.parse(payload);
      const token = json.choices?.[0]?.delta?.content || "";
      fullText += token;
      onChunk?.(token); // callback to push to res.write() in your route
    }
  }
  return fullText;
}