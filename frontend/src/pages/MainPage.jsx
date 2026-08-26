import { useEffect, useRef, useState } from "react";

import Sidebar from "../components/Sidebar";
import ChatHeader from "../components/chats/ChatHeader";
import MessageBubble from "../components/chats/MessageBubble";
import ChatInput from "../components/chats/ChatInput";

import { AuthProvider } from "../context/AuthContext";
import { proUser } from "../api/auth";
import { useChat } from "../hooks/useChat";

export default function MainPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [tokenSize, setTokenSize] = useState("Short");
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);

  const messagesContainerRef = useRef(null);
  const messagesEndRef = useRef(null);

  const { refreshAuth } = AuthProvider.useAuth();

  const {
    messages,
    isLoading,
    currentChatId,
    isSendingRef,
    newChat,
    selectChat,
    sendMessage,
    editMessage,
  } = useChat();

  // -------------------------
  // Pro
  // -------------------------

  const handlePro = async () => {
    try {
      await proUser();
      await refreshAuth();
    } catch (err) {
      console.error(
        "User update failed:",
        err?.response?.data?.message || err?.message,
      );
    }
  };

  // -------------------------
  // Mobile breakpoint
  // -------------------------

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // -------------------------
  // Scroll helpers
  // -------------------------

  const scrollToBottom = (behavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({
      behavior,
      block: "end",
    });
  };

  const handleMessagesScroll = (e) => {
    const element = e.currentTarget;

    const distanceFromBottom =
      element.scrollHeight - element.scrollTop - element.clientHeight;

    setShowScrollButton(distanceFromBottom > 200);
  };

  // Auto-scroll only when user is already near the bottom
  useEffect(() => {
    const container = messagesContainerRef.current;

    if (!container) return;

    const distanceFromBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight;

    if (distanceFromBottom < 200) {
      scrollToBottom("smooth");
    }
  }, [messages]);

  // -------------------------
  // Sidebar
  // -------------------------

  const toggleSidebar = () => {
    if (isSendingRef.current) return;

    setSidebarOpen((prev) => !prev);
  };

  // -------------------------
  // Render
  // -------------------------

  return (
<div className="fixed inset-0 flex overflow-hidden bg-[#f7f7f8] dark:bg-[#0a0a0c]">
        <Sidebar
        isOpen={sidebarOpen}
        isMobile={isMobile}
        onToggle={toggleSidebar}
        onSelectChat={selectChat}
        onNewChat={newChat}
        selectedChatId={currentChatId}
        onChatSelected={() => {
          if (isMobile) {
            setSidebarOpen(false);
          }
        }}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <ChatHeader
          onHistoryClick={toggleSidebar}
          onProClick={handlePro}
          profileMenuOpen={profileMenuOpen}
          onProfileMenuChange={setProfileMenuOpen}
        />

        {/* ONLY THIS AREA SCROLLS */}
        <div
          ref={messagesContainerRef}
          onScroll={handleMessagesScroll}
          className="
            relative
            flex min-h-0 flex-1
            flex-col gap-3
            overflow-y-auto
            px-4 py-4
            sm:px-6
          "
        >
          {messages.length === 0 ? (
            <div className="flex flex-1 items-center justify-center text-[#6b6b73] dark:text-[#8a8a92]">
              Start a conversation
            </div>
          ) : (
            messages.map((msg, index) => (
              <MessageBubble
                key={msg._id || index}
                role={msg.role}
                content={msg.content}
                createdAt={msg.createdAt}
                onEdit={
                  msg.role === "user"
                    ? (newContent) =>
                        editMessage(msg._id, newContent, tokenSize)
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

          {/* Bottom target */}
          <div ref={messagesEndRef} />

          {/* Go to bottom */}
          {showScrollButton && (
            <button
              type="button"
              onClick={() => scrollToBottom("smooth")}
              className="
                sticky bottom-4 left-1/2 z-20
                self-center
                -translate-x-1/2
                rounded-full
                border border-[#e5e7eb]
                bg-white/95
                px-4 py-2
                text-sm font-medium
                text-[#374151]
                shadow-[0_8px_30px_rgba(0,0,0,0.12)]
                backdrop-blur
                transition
                animate-bounce
                hover:-translate-y-0.5
                hover:shadow-xl
                dark:border-[#2a2a32]
                dark:bg-[#18181d]/95
                dark:text-[#f5f5f7]
              "
            >
              ↓ Go to bottom
            </button>
          )}
        </div>

        <ChatInput
          onSend={sendMessage}
          disabled={isLoading}
          tokenSize={tokenSize}
          onTokenSizeChange={setTokenSize}
          onProClick={() => setProfileMenuOpen(true)}
        />
      </div>
    </div>
  );
}
