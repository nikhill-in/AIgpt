import { useState } from "react";
import ChatHeader from "../components/chats/ChatHeader";
import MessageBubble from "../components/chats/MessageBubble";
import ChatInput from "../components/chats/ChatInput";
import { getChatMessages, sendMessageStream } from "../api/chat";
import Sidebar from "../components/Sidebar";



export default function MainPage() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSelectChat = async (chatId) => {
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

  const handleSend = async (text, tSize) => {
    const userMessage = { role: "user", content: text };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    let assistantText = "";
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    try {
      await sendMessageStream(
        currentChatId,
        text,
        (token) => {
          assistantText += token;
          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = {
              role: "assistant",
              content: assistantText,
            };
            return updated;
          });
        },
        (newChatId) => {
          if (!currentChatId) setCurrentChatId(newChatId);
        },
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
        onHistoryClick={() => setSidebarOpen(sidebarOpen ? false : true)}
      />

      <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-6 py-4">
        {messages.length === 0 ? (
          <div className="flex flex-1 items-center justify-center text-[#6b6b73] dark:text-[#8a8a92]">
            Start a conversation
          </div>
        ) : (
          messages.map((msg, i) => (
            <MessageBubble key={i} role={msg.role} content={msg.content} />
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
