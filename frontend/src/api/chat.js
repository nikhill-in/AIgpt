export async function sendMessageStream(chatId, content, onToken, onChatId) {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/user/chat`, {
    method: "POST",
    credentials: "include", // sends the auth cookie, same as your axios instance
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chatId, content }),
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let fullText = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop();

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data: ")) continue;

      const payload = trimmed.slice(6).trim();
      if (payload === "[DONE]") continue;

      try {
        const json = JSON.parse(payload);

        if (json.chatId) {
          onChatId?.(json.chatId);
        }

        if (json.text) {
          fullText += json.text;
          onToken?.(json.text);
        }

        if (json.error) {
          throw new Error(json.error);
        }
      } catch (e) {
        console.error("Bad SSE payload from server:", payload);
      }
    }
  }

  return fullText;
}