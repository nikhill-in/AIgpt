import { useRef, useState } from "react";

import ChatHeader from "../components/chats/ChatHeader";
import MessageBubble from "../components/chats/MessageBubble";
import ChatInput from "../components/chats/ChatInput";
import Sidebar from "../components/Sidebar";

import {
  getChatMessages,
  sendMessageStream,
  editMessageStream,
} from "../api/chat";

import { proUser } from "../api/auth";
import { AuthProvider } from "../context/AuthContext";

function revealGradually(chunk, onChar, speedMs = 15) {
  return new Promise((resolve) => {
    let i = 0;

    const interval = setInterval(() => {
      if (i >= chunk.length) {
        clearInterval(interval);
        resolve();
        return;
      }

      onChar(chunk[i++]);
    }, speedMs);
  });
}

export default function MainPage() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [tSize, setTSize] = useState(700);

  const { refreshAuth } = AuthProvider.useAuth();

  const isSendingRef = useRef(false);

  const handleNewChat = () => {
    if (isSendingRef.current) return;

    setCurrentChatId(null);
    setMessages([]);
  };

  const handlePro = async () => {
    try {
      await proUser();
      await refreshAuth();
    } catch (err) {
      console.error(
        "User update failed:",
        err.response?.data?.message || err.message,
      );
    }
  };

  const handleSelectChat = async (chatId) => {
    if (isSendingRef.current) return;

    setCurrentChatId(chatId);
    setIsLoading(true);

    try {
      setMessages(await getChatMessages(chatId));
    } catch (err) {
      console.error("Error fetching chat messages:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateLastMessage = (content) => {
    setMessages((prev) => {
      const updated = [...prev];

      updated[updated.length - 1] = {
        ...updated[updated.length - 1],
        content,
      };

      return updated;
    });
  };

  const addAssistantMessage = () => {
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: "",
        createdAt: new Date().toISOString(),
      },
    ]);
  };

  const handleStreamError = (err) => {
    console.error("Message generation failed:", err);

    setMessages((prev) => [
      ...prev.slice(0, -1),
      {
        role: "assistant",
        content: err.message || "Something went wrong. Please try again.",
        createdAt: new Date().toISOString(),
      },
    ]);
  };

  const streamResponse = async (streamFn, onChatId) => {
    let assistantText = "";

    await streamFn(async (token) => {
      await revealGradually(token, (char) => {
        assistantText += char;
        updateLastMessage(assistantText);
      });
    }, onChatId);
  };

  const handleSend = async (text, size) => {
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: text,
        createdAt: new Date().toISOString(),
      },
    ]);

    addAssistantMessage();

    setIsLoading(true);
    isSendingRef.current = true;

    try {
      await streamResponse(
        (onToken, onChatId) =>
          sendMessageStream(currentChatId, text, onToken, onChatId, size),
        (newChatId) => {
          if (!currentChatId) {
            setCurrentChatId(newChatId);
          }
        },
      );
    } catch (err) {
      handleStreamError(err);
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
      {
        role: "user",
        content: newContent,
        createdAt: new Date().toISOString(),
      },
      {
        role: "assistant",
        content: "",
        createdAt: new Date().toISOString(),
      },
    ]);

    setIsLoading(true);
    isSendingRef.current = true;

    try {
      await streamResponse(
        (onToken) =>
          editMessageStream(messageId, newContent, onToken, () => {}, tSize),
        () => {},
      );
    } catch (err) {
      handleStreamError(err);
    } finally {
      setIsLoading(false);
      isSendingRef.current = false;
    }
  };

  return (
    <div className="flex h-screen bg-[#f7f7f8] dark:bg-[#0a0a0c]">
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => {
          if (isSendingRef.current) return;
          setSidebarOpen((prev) => !prev);
        }}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        selectedChatId={currentChatId}
      />

      <div className="flex min-w-0 flex-1 flex-col">
       <ChatHeader
  onHistoryClick={() => {
    if (isSendingRef.current) return;
    setSidebarOpen((prev) => !prev);
  }}
  onProClick={handlePro}
  profileMenuOpen={profileMenuOpen}
  onProfileMenuChange={setProfileMenuOpen}
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
                onEdit={
                  msg.role === "user"
                    ? (newContent) => handleEdit(msg._id, newContent)
                    : undefined
                }
              />
            ))
          )}

          {isLoading && (
            <div className="text-sm text-[#6b6b73] dark:text-[#8a8a92]">
              Thinking...
            </div>
          )}
        </div>

        <ChatInput
  onSend={handleSend}
  disabled={isLoading}
  tSize={tSize}
  onTSizeChange={setTSize}
  onProClick={() => setProfileMenuOpen(true)}
/>
      </div>
    </div>
  );
}
