import { useState } from "react";
import ChatHeader from "../components/chat/ChatHeader.jsx";
import MessageBubble from "../components/chat/MessageBubble.jsx";
import ChatInput from "../components/chat/ChatInput.jsx";

export default function MainPage() {
  const [messages, setMessages] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (text) => {
    const userMessage = { role: "user", content: text };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // TODO: replace with real API call, e.g.
      // const res = await sendChatMessage(text);
      // setMessages((prev) => [...prev, { role: "assistant", content: res.data.reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Something went wrong. Try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const visibleMessages = searchQuery
    ? messages.filter((m) =>
        m.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : messages;

  return (
    <div className="flex h-screen flex-col bg-[#0a0a0c]">
      <ChatHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-6 py-4">
        {visibleMessages.length === 0 ? (
          <div className="flex flex-1 items-center justify-center text-[#8a8a92]">
            Start a conversation
          </div>
        ) : (
          visibleMessages.map((msg, i) => (
            <MessageBubble key={i} role={msg.role} content={msg.content} />
          ))
        )}
        {isLoading && (
          <div className="text-sm text-[#8a8a92]">Thinking...</div>
        )}
      </div>

      <ChatInput onSend={handleSend} disabled={isLoading} />
    </div>
  );
}