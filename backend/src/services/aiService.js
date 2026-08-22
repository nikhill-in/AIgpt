

export async function chatService(input, instructions, onChunk, tSize) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/openai/chat/completions`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GEMINI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gemini-2.5-flash",
        messages: [
          { role: "system", content: instructions },
          { role: "user", content: input },
        ],
        stream: true,
        max_tokens: tSize,
        temperature: 0.7,
      }),
    }
  );

  console.log("STATUS:", response.status, response.statusText);

 if (!response.ok) {
  const errText = await response.text();

  console.error(
    `Gemini API error ${response.status}:`,
    errText
  );

  if (response.status === 503) {
    throw new Error(
      "AI service is temporarily busy. Please try again in a moment."
    );
  }

  if (response.status === 429) {
    throw new Error(
      "Too many requests. Please wait a moment and try again."
    );
  }

  throw new Error(
    "AI service is currently unavailable. Please try again later."
  );
}

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let fullText = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const rawChunk = decoder.decode(value, { stream: true });
    // console.log("RAW CHUNK:", JSON.stringify(rawChunk));

    buffer += rawChunk;
    const lines = buffer.split("\n");
    buffer = lines.pop(); // keep incomplete last line for next read

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data: ")) continue;

      const payload = trimmed.slice(6).trim();
      if (payload === "[DONE]") continue;

      try {
        const json = JSON.parse(payload);
        // console.log("PARSED JSON:", JSON.stringify(json));

        const token = json.choices?.[0]?.delta?.content || "";
        if (token) {
          fullText += token;
          onChunk?.(token);
        }
      } catch (e) {
        console.error("Bad SSE payload, could not parse:", payload);
      }
    }
  }

  // console.log("FINAL fullText:", JSON.stringify(fullText));
  return fullText;
}