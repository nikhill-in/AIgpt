import { useState, useRef } from "react";
import ChatHeader from "../components/chats/ChatHeader";
import MessageBubble from "../components/chats/MessageBubble";
import ChatInput from "../components/chats/ChatInput";
import { getChatMessages, sendMessageStream, editMessageStream } from "../api/chat";
import Sidebar from "../components/Sidebar";

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

export default function MainPage() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tSize, setTSize] = useState(700); // lifted up so handleEdit can access it too

  const isSendingRef = useRef(false);

  const handleSelectChat = async (chatId) => {
    if (isSendingRef.current) return;
    setSidebarOpen(false);
    setCurrentChatId(chatId);
    setIsLoading(true);
    try {
      const msgs = await getChatMessages(chatId);
      setMessages(msgs);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async (text, size) => {
    const userMessage = { role: "user", content: text, createdAt: new Date().toISOString() };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    isSendingRef.current = true;

    let assistantText = "";
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: "", createdAt: new Date().toISOString() },
    ]);

    try {
      await sendMessageStream(
        currentChatId,
        text,
        async (token) => {
          await revealGradually(token, (char) => {
            assistantText += char;
            setMessages((prev) => {
              const updated = [...prev];
              updated[updated.length - 1] = { ...updated[updated.length - 1], content: assistantText };
              return updated;
            });
          });
        },
        (newChatId) => {
          if (!currentChatId) setCurrentChatId(newChatId);
        },
        size,
      );
    } catch (err) {
      console.log(err);
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { role: "assistant", content: "Something went wrong. Try again." },
      ]);
    } finally {
      setIsLoading(false);
      isSendingRef.current = false;
    }
  };

  const handleEdit = async (messageId, newContent) => {
    const editIndex = messages.findIndex((m) => m._id === messageId);
    if (editIndex === -1) return;

    setMessages((prev) => [
      ...prev.slice(0, editIndex),
      { role: "user", content: newContent, createdAt: new Date().toISOString() },
      { role: "assistant", content: "", createdAt: new Date().toISOString() },
    ]);
    setIsLoading(true);
    isSendingRef.current = true;

    let assistantText = "";

    try {
      await editMessageStream(
        messageId,
        newContent,
        async (token) => {
          await revealGradually(token, (char) => {
            assistantText += char;
            setMessages((prev) => {
              const updated = [...prev];
              updated[updated.length - 1] = { ...updated[updated.length - 1], content: assistantText };
              return updated;
            });
          });
        },
        () => {},
        tSize,
      );
    } catch (err) {
      console.log(err);
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { role: "assistant", content: "Something went wrong. Try again." },
      ]);
    } finally {
      setIsLoading(false);
      isSendingRef.current = false;
    }
  };

  return (
    <div className="flex h-screen flex-col bg-[#f7f7f8] dark:bg-[#0a0a0c]">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onSelectChat={handleSelectChat}
      />
      <ChatHeader
        onHistoryClick={() => {
          if (isSendingRef.current) return;
          setSidebarOpen((prev) => !prev);
        }}
      />

      <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-6 py-4">
        {messages.length === 0 ? (
          <div className="flex flex-1 items-center justify-center text-[#6b6b73] dark:text-[#8a8a92]">
            Start a conversation
          </div>
        ) : (
          messages.map((msg, i) => (
            <MessageBubble
              key={msg._id || i}
              role={msg.role}
              content={msg.content}
              createdAt={msg.createdAt}
              onEdit={msg.role === "user" ? (newContent) => handleEdit(msg._id, newContent) : undefined}
            />
          ))
        )}
        {isLoading && (
          <div className="text-sm text-[#6b6b73] dark:text-[#8a8a92]">
            Thinking...
          </div>
        )}
      </div>

      <ChatInput onSend={handleSend} disabled={isLoading} />
    </div>
  );
}


// import { useState } from "react";
// import ChatHeader from "../components/chats/ChatHeader";
// import MessageBubble from "../components/chats/MessageBubble";
// import ChatInput from "../components/chats/ChatInput";
// import { getChatMessages, sendMessageStream, editMessageStream } from "../api/chat";
// import Sidebar from "../components/Sidebar";



// export default function MainPage() {
//   const [messages, setMessages] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [currentChatId, setCurrentChatId] = useState(null);
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   const handleSelectChat = async (chatId) => {
//     setSidebarOpen(false);
//     setCurrentChatId(chatId);
//     setIsLoading(true);
//     try {
//       const msgs = await getChatMessages(chatId);
//       setMessages(msgs);
//     } catch (err) {
//       console.log(err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleSend = async (text, tSize) => {
//     const userMessage = { role: "user", content: text };
//     setMessages((prev) => [...prev, userMessage]);
//     setIsLoading(true);

//     let assistantText = "";
//     setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

//     try {
//       await sendMessageStream(
//         currentChatId,
//         text,
//         (token) => {
//           assistantText += token;
//           setMessages((prev) => {
//             const updated = [...prev];
//             updated[updated.length - 1] = {
//               role: "assistant",
//               content: assistantText,
//             };
//             return updated;
//           });
//         },
//         (newChatId) => {
//           if (!currentChatId) setCurrentChatId(newChatId);
//         },
//         tSize,
//       );
//     } catch (err) {
//       console.log(err);
//       setMessages((prev) => [
//         ...prev.slice(0, -1),
//         { role: "assistant", content: "Something went wrong. Try again." },
//       ]);
//     } finally {
//       setIsLoading(false);
//     }
//   };


// const handleEdit = async (messageId, newContent, tSize) => {
//   // Find where this message sits, truncate local state to before it
//   const editIndex = messages.findIndex((m) => m._id === messageId);
//   if (editIndex === -1) return;

//   setMessages((prev) => [
//     ...prev.slice(0, editIndex),
//     { role: "user", content: newContent, createdAt: new Date().toISOString() },
//     { role: "assistant", content: "", createdAt: new Date().toISOString() },
//   ]);
//   setIsLoading(true);
//   isSendingRef.current = true;

//   let assistantText = "";
//   const updateLastMessage = (fullContent) => {
//     setMessages((prev) => {
//       const updated = [...prev];
//       updated[updated.length - 1] = { ...updated[updated.length - 1], content: fullContent };
//       return updated;
//     });
//   };

//   try {
//     await editMessageStream(
//       messageId,
//       newContent,
//       async (token) => {
//         await revealGradually(token, (char) => {
//           assistantText += char;
//           updateLastMessage(assistantText);
//         });
//       },
//       () => {},
//       tSize,
//     );
//   } catch (err) {
//     console.log(err);
//     setMessages((prev) => [
//       ...prev.slice(0, -1),
//       { role: "assistant", content: "Something went wrong. Try again." },
//     ]);
//   } finally {
//     setIsLoading(false);
//     isSendingRef.current = false;
//   }
// };

//   return (
//     <div className="flex h-screen flex-col bg-[#9c9c9c] dark:bg-[#0a0a0c]">
//       <Sidebar
//         isOpen={sidebarOpen}
//         onClose={() => setSidebarOpen(false)}
//         onSelectChat={handleSelectChat}
//       />
//       <ChatHeader
//         onHistoryClick={() => setSidebarOpen(sidebarOpen ? false : true)}
//       />

//       <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-6 py-4">
//         {messages.length === 0 ? (
//           <div className="flex flex-1 items-center justify-center text-black dark:text-[#8a8a92]">
//             Start a conversation
//           </div>
//         ) : (
//           messages.map((msg, i) => (
//             <MessageBubble key={i} role={msg.role} content={msg.content} onEdit={msg.role === "user" ? (newContent) => handleEdit(msg._id, newContent, currentTSize) : undefined} />
//           ))
//         )}
//         {isLoading && (
//           <div className="text-sm text-black dark:text-[#8a8a92]">
//             Thinking...
//           </div>
//         )}
//       </div>

//       <ChatInput onSend={handleSend} disabled={isLoading} />
//     </div>
//   );
// }
