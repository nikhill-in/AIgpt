import api from "./axios";





export const getTokenOptions = () => api.get("/auth/token-options");

// send message ================

export async function sendMessageStream(
  chatId,
  content,
  onToken,
  onChatId,
  tSize,
) {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/user/send`, {
    method: "POST",
    credentials: "include", // sends the auth cookie, same as your axios instance
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chatId, content, tSize }),
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
          await onToken?.(json.text);
        }

        if (json.error) {
          throw new Error(json.error);
        }
      } catch (e) {
        console.error("Bad SSE payload from server:", e, payload);
      }
    }
  }

  return fullText;
}

export async function getChats() {
  const res = await api.get(`/user/chats`);

    
  return res.data;
}

export async function getChatMessages(chatId) {
  const res = await api.get(`/user/message/${chatId}`);

   

  return res.data;
}

export async function deleteChatMessages(chatId) {
  const res = await api.delete(`/user/message/${chatId}`);

   
  

  return res.data;
}

export async function renameChat(chatId, title) {
  const res = await api.patch(`/user/rename/${chatId}`, { title });

   

  return res.data;
}

//edit message===========

export async function editMessageStream(
  messageId,
  content,
  onToken,
  onChatId,
  tSize,
) {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/user/edit`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messageId, content, tSize }),
  });

     


  if (!response.ok) throw new Error(`Request failed: ${response.status}`);

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
        if (json.chatId) onChatId?.(json.chatId);
        if (json.text) {
          fullText += json.text;
          await onToken?.(json.text);
        }
        if (json.error) throw new Error(json.error);
      } catch (e) {
        console.error("Bad SSE payload from server:", e, payload);
      }
    }
  }

  return fullText;
}
