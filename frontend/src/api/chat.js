import servers from "../environment";
import api from "./axios";

export async function sendMessageStream(
  chatId,
  content,
  onToken,
  onChatId,
  tSize,
  signal,
) {
  const response = await fetch(
    `${servers}/user/send`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "text/event-stream",
      },
      body: JSON.stringify({
        chatId,
        content,
        tSize,
      }),
      signal,
    },
  );

  if (!response.ok) {
    let message = `Request failed: ${response.status}`;

    try {
      const data = await response.json();

      message =
        data?.message ||
        data?.error ||
        message;
    } catch {
      // Response wasn't JSON; keep the default message.
    }

    const error = new Error(message);
    error.status = response.status;

    if (response.status === 401) {
      window.dispatchEvent(new Event("auth:unauthorized"));
    }

    throw error;
  }

  if (!response.body) {
    throw new Error("Streaming response is unavailable.");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  let buffer = "";
  let fullText = "";

  try {
    while (true) {
      const { value, done } = await reader.read();

      if (done) break;

      buffer += decoder.decode(value, {
        stream: true,
      });

      const events = buffer.split(/\r?\n\r?\n/);
      buffer = events.pop() || "";

      for (const event of events) {
        const dataLines = event
          .split(/\r?\n/)
          .filter((line) => line.startsWith("data:"));

        if (!dataLines.length) continue;

        const payload = dataLines
          .map((line) => line.slice(5).trim())
          .join("\n")
          .trim();

        if (!payload) continue;

        if (payload === "[DONE]") {
          return fullText;
        }

        let data;

        try {
          data = JSON.parse(payload);
        } catch (error) {
          console.error("Invalid SSE payload:", {
            payload,
            error,
          });
          continue;
        }

        if (data.chatId) {
          onChatId?.(data.chatId);
        }

        if (data.error) {
          throw new Error(data.error);
        }

        if (typeof data.text === "string") {
          fullText += data.text;
          await onToken?.(data.text);
        }
      }
    }

    return fullText;
  } catch (error) {
    if (error.name === "AbortError") {
      return fullText;
    }

    throw error;
  } finally {
    reader.releaseLock();
  }
}


export async function getChats() {
  const res = await api.get(`/user/chats`);

    
  return res.data.chats;
}

export async function getChatMessages(chatId) {
  const res = await api.get(`/user/message/${chatId}`);

   

  return res.data.messages;
}

export async function deleteChatMessages(chatId) {
  const res = await api.delete(`/user/message/${chatId}`);

   
  

  return res.data;
}

export async function renameChat(chatId, title) {
  const res = await api.patch(`/user/rename/${chatId}`, { title });

   

  return res.data.chat;
}

//edit message===========

export async function editMessageStream(
  messageId,
  content,
  onToken,
  onChatId,
  tSize,
  signal,
) {
  const response = await fetch(`${servers}/user/edit`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messageId,
      content,
      tSize,
    }),
    signal,
  });

  if (!response.ok) {
    throw new Error(
      `Request failed: ${response.status}`,
    );
  }

  if (!response.body) {
    throw new Error(
      "Streaming response is unavailable.",
    );
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  let buffer = "";
  let fullText = "";

  try {
    while (true) {
      const { done, value } =
        await reader.read();

      if (done) {
        break;
      }

      buffer += decoder.decode(value, {
        stream: true,
      });

      const lines = buffer.split(/\r?\n/);

      buffer = lines.pop() || "";

      for (const line of lines) {
        const trimmed = line.trim();

        if (!trimmed.startsWith("data:")) {
          continue;
        }

        const payload = trimmed
          .slice(5)
          .trim();

        if (!payload) {
          continue;
        }

        if (payload === "[DONE]") {
          return fullText;
        }

        try {
          const json = JSON.parse(payload);

          if (json.chatId) {
            onChatId?.(json.chatId);
          }

          if (typeof json.text === "string") {
            fullText += json.text;

            await onToken?.(json.text);
          }

          if (json.error) {
            throw new Error(json.error);
          }
        } catch (error) {
          console.error(
            "Bad SSE payload from server:",
            error,
            payload,
          );
        }
      }
    }

    return fullText;
  } catch (error) {
    if (error?.name === "AbortError") {
      throw error;
    }

    throw error;
  } finally {
    reader.releaseLock();
  }
}

// export async function editMessageStream(
//   messageId,
//   content,
//   onToken,
//   onChatId,
//   tSize,
// ) {
//   const response = await fetch(`${servers}/user/edit`, {
//     method: "POST",
//     credentials: "include",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ messageId, content, tSize }),
//   });

     


//   if (!response.ok) throw new Error(`Request failed: ${response.status}`);

//   const reader = response.body.getReader();
//   const decoder = new TextDecoder();
//   let buffer = "";
//   let fullText = "";

//   while (true) {
//     const { done, value } = await reader.read();
//     if (done) break;

//     buffer += decoder.decode(value, { stream: true });
//     const lines = buffer.split("\n");
//     buffer = lines.pop();

//     for (const line of lines) {
//       const trimmed = line.trim();
//       if (!trimmed.startsWith("data: ")) continue;

//       const payload = trimmed.slice(6).trim();
//       if (payload === "[DONE]") continue;

//       try {
//         const json = JSON.parse(payload);
//         if (json.chatId) onChatId?.(json.chatId);
//         if (json.text) {
//           fullText += json.text;
//           await onToken?.(json.text);
//         }
//         if (json.error) throw new Error(json.error);
//       } catch (e) {
//         console.error("Bad SSE payload from server:", e, payload);
//       }
//     }
//   }
  
//   return fullText;
// }

// Star chats==========
export const toggleChatStar = async (chatId) => {
  const res = await api.patch(`/user/${chatId}/star`);
  return res.data;
};