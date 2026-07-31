import { useState } from "react";
import ChatHeader from "../components/chats/ChatHeader";
import MessageBubble from "../components/chats/MessageBubble";
import ChatInput from "../components/chats/ChatInput";
import { sendMessageStream } from "../api/chat";

export default function MainPage() {
  const [messages, setMessages] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentChatId, setCurrentChatId] = useState(null);

  const handleSend = async (text) => {
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
      );
    } catch (err) {
        console.log(err)
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { role: "assistant", content: "Something went wrong. Try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const visibleMessages = searchQuery
    ? messages.filter((m) =>
        m.content.toLowerCase().includes(searchQuery.toLowerCase()),
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
        {isLoading && <div className="text-sm text-[#8a8a92]">Thinking...</div>}
      </div>

      <ChatInput onSend={handleSend} disabled={isLoading} />
    </div>
  );
}
