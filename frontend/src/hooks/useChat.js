import { useCallback, useRef, useState } from "react";
import { getChatMessages, sendMessageStream, editMessageStream } from "../api/chat";

const createMessage = (role, content = "") => ({
  role,
  content,
  createdAt: new Date().toISOString(),
});

// revealGradually — kept from before, prevents the "dhapp se aata hai" problem
function revealGradually(chunk, onChar, speedMs = 15) {
  return new Promise((resolve) => {
    let i = 0;
    const interval = setInterval(() => {
      onChar(chunk[i]);
      i++;
      if (i >= chunk.length) {
        clearInterval(interval);
        resolve();
      }
    }, speedMs);
  });
}

export function useChat() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentChatId, setCurrentChatId] = useState(null);
  const isSendingRef = useRef(false);

  const updateLastMessage = useCallback((content) => {
    setMessages((prev) => {
      if (!prev.length) return prev;
      const updated = [...prev];
      updated[updated.length - 1] = { ...updated[updated.length - 1], content };
      return updated;
    });
  }, []);

  const streamResponse = useCallback(
    async (streamFn, onNewChatId) => {
      let assistantText = "";

      await streamFn(
        async (token) => {
          // reveal gradually per token — prevents all-at-once dump
          await revealGradually(token, (char) => {
            assistantText += char;
            updateLastMessage(assistantText);
          });
        },
        onNewChatId,
      );
    },
    [updateLastMessage],
  );

//   const handleStreamError = useCallback((err) => {
//     if (err?.response?.status === 401) return; // interceptor handles redirect
//     console.error("Stream error:", err?.response?.data?.message || err?.message);
//     setMessages((prev) => [
//       ...prev.slice(0, -1),
//       createMessage("assistant", err?.response?.data?.message || "Something went wrong. Please try again."),
//     ]);
//   }, []);

const handleStreamError = useCallback((err) => {
  if (err?.status === 401 || err?.response?.status === 401) {
    return;
  }

  const message =
    err?.response?.data?.message ||
    err?.message ||
    "Something went wrong. Please try again.";

  console.error("Stream error:", message);

  setMessages((prev) => [
    ...prev.slice(0, -1),
    createMessage("assistant", message),
  ]);
}, []);


  const runStreamingAction = useCallback(
    async (streamFn, onNewChatId) => {
      setIsLoading(true);
      isSendingRef.current = true;
      try {
        await streamResponse(streamFn, onNewChatId);
      } catch (err) {
        handleStreamError(err);
      } finally {
        setIsLoading(false);
        isSendingRef.current = false;
      }
    },
    [streamResponse, handleStreamError],
  );

  const newChat = useCallback(() => {
    if (isSendingRef.current) return;
    setCurrentChatId(null);
    setMessages([]);
  }, []);

  const selectChat = useCallback(async (chatId) => {
    if (isSendingRef.current) return;
    setCurrentChatId(chatId);
    setIsLoading(true);
    try {
      const msgs = await getChatMessages(chatId);
      setMessages(Array.isArray(msgs) ? msgs : []); // guard against unexpected shape
    } catch (err) {
      console.error("Error fetching messages:", err?.response?.data?.message || err?.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const sendMessage = useCallback(
    async (text, size) => {
      setMessages((prev) => [
        ...prev,
        createMessage("user", text),
        createMessage("assistant"),
      ]);

      await runStreamingAction(
        (onToken, onNewChatId) =>
          sendMessageStream(currentChatId, text, onToken, onNewChatId, size),
        (newChatId) => {
          if (!currentChatId) setCurrentChatId(newChatId);
        },
      );
    },
    [currentChatId, runStreamingAction],
  );

  const editMessage = useCallback(
    async (messageId, newContent, tokenSize) => {
      const editIndex = messages.findIndex((m) => m._id === messageId);
      if (editIndex === -1) return;

      setMessages((prev) => [
        ...prev.slice(0, editIndex),
        createMessage("user", newContent),
        createMessage("assistant"),
      ]);

      await runStreamingAction(
        (onToken) =>
          editMessageStream(messageId, newContent, onToken, () => {}, tokenSize),
        () => {},
      );
    },
    [messages, runStreamingAction],
  );

  return {
    messages,
    isLoading,
    currentChatId,
    isSendingRef,
    newChat,
    selectChat,
    sendMessage,
    editMessage,
  };
}


// import { useCallback, useRef, useState } from "react";

// import {
//   getChatMessages,
//   sendMessageStream,
//   editMessageStream,
// } from "../api/chat";

// const createMessage = (role, content = "") => ({
//   role,
//   content,
//   createdAt: new Date().toISOString(),
// });

// export function useChat() {
//   const [messages, setMessages] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [currentChatId, setCurrentChatId] = useState(null);

//   const isSendingRef = useRef(false);

//   const updateLastMessage = useCallback((content) => {
//     setMessages((prev) => {
//       if (!prev.length) return prev;

//       const updated = [...prev];

//       updated[updated.length - 1] = {
//         ...updated[updated.length - 1],
//         content,
//       };

//       return updated;
//     });
//   }, []);

//   const streamResponse = useCallback(
//     async (streamFn, onChatId) => {
//       let assistantText = "";

//       await streamFn(async (token) => {
//         assistantText += token;

//         updateLastMessage(assistantText);
//       }, onChatId);
//     },
//     [updateLastMessage],
//   );

//   const handleStreamError = useCallback((err) => {
//     if (err.response?.status === 401) return;

//     console.error(
//       "Message generation failed:",
//       err.response?.data?.message || err.message,
//     );

//     setMessages((prev) => [
//       ...prev.slice(0, -1),
//       createMessage(
//         "assistant",
//         err.response?.data?.message ||
//           err.message ||
//           "Something went wrong. Please try again.",
//       ),
//     ]);
//   }, []);

//   const runStreamingAction = useCallback(
//     async (streamFn, onChatId) => {
//       setIsLoading(true);
//       isSendingRef.current = true;

//       try {
//         await streamResponse(streamFn, onChatId);
//       } catch (err) {
//         handleStreamError(err);
//       } finally {
//         setIsLoading(false);
//         isSendingRef.current = false;
//       }
//     },
//     [streamResponse, handleStreamError],
//   );

//   const newChat = useCallback(() => {
//     if (isSendingRef.current) return;

//     setCurrentChatId(null);
//     setMessages([]);
//   }, []);

//   const selectChat = useCallback(async (chatId) => {
//     if (isSendingRef.current) return;

//     setCurrentChatId(chatId);
//     setIsLoading(true);

//     try {
//       setMessages(await getChatMessages(chatId));
//     } catch (err) {
//       console.error(
//         "Error fetching chat messages:",
//         err.response?.data?.message || err.message,
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   }, []);

//   const sendMessage = useCallback(
//     async (text, size) => {
//       setMessages((prev) => [
//         ...prev,
//         createMessage("user", text),
//         createMessage("assistant"),
//       ]);

//       await runStreamingAction(
//         (onToken, onChatId) =>
//           sendMessageStream(
//             currentChatId,
//             text,
//             onToken,
//             onChatId,
//             size,
//           ),
//         (newChatId) => {
//           if (!currentChatId) {
//             setCurrentChatId(newChatId);
//           }
//         },
//       );
//     },
//     [currentChatId, runStreamingAction],
//   );

//   const editMessage = useCallback(
//     async (messageId, newContent, tokenSize) => {
//       const editIndex = messages.findIndex(
//         (message) => message._id === messageId,
//       );

//       if (editIndex === -1) return;

//       setMessages((prev) => [
//         ...prev.slice(0, editIndex),
//         createMessage("user", newContent),
//         createMessage("assistant"),
//       ]);

//       await runStreamingAction(
//         (onToken) =>
//           editMessageStream(
//             messageId,
//             newContent,
//             onToken,
//             () => {},
//             tokenSize,
//           ),
//         () => {},
//       );
//     },
//     [messages, runStreamingAction],
//   );

//   return {
//     messages,
//     isLoading,
//     currentChatId,
//     isSendingRef,
//     newChat,
//     selectChat,
//     sendMessage,
//     editMessage,
//   };
// }