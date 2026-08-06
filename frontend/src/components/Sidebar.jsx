import { useState, useEffect } from "react";
import {
  PlusIcon,
  HistoryIcon,
  LogOutIcon,
  TrashIcon,
  Cross,
  Crosshair,
  CrosshairIcon,
  CrossIcon,
  Edit,
} from "lucide-react";
import { deleteChatMessages, getChats } from "../api/chat";
import { useAuth } from "../context/AuthContext";

export default function Sidebar({ isOpen, onToggle, onSelectChat, onNewChat }) {
  const { logout } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    getChats()
      .then(setHistory)
      .catch(() => setHistory([]))
      .finally(() => setLoading(false));
  }, [isOpen]);

  const handleDelete = async (e, chatId) => {
    e.stopPropagation(); // don't also trigger onSelectChat on the parent row
    try {
      await deleteChatMessages(chatId);
      setHistory((prev) => prev.filter((chat) => chat._id !== chatId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <aside
      className={`
        flex h-screen flex-col border-r border-[#e5e5e8] dark:border-[#26262c]
        bg-white dark:bg-[#141418]
        transition-all duration-300 ease-in-out
        ${isOpen ? "w-72" : "w-16"}
      `}
    >
      {/* Top icons — always visible, regardless of expanded state */}
      <div className="flex flex-col gap-1 p-2">
        <button
          onClick={onNewChat}
          aria-label="New chat"
          title="New chat"
          className="flex h-10 items-center gap-2 rounded-lg px-3 text-[#6b6b73] transition hover:bg-[#eaeaec] hover:text-[#1a1a1e] dark:text-[#8a8a92] dark:hover:bg-[#22222a] dark:hover:text-[#f5f5f7]"
        >
          <PlusIcon size={18} className="shrink-0" />

          {isOpen && <span className="whitespace-nowrap ">New Chat</span>}
        </button>

        <button
          onClick={onToggle}
          aria-label="Toggle history"
          title="History"
          className="flex h-10 w-10 items-center justify-center rounded-lg text-[#6b6b73] dark:text-[#8a8a92] transition hover:bg-[#eaeaec] dark:hover:bg-[#22222a] hover:text-[#1a1a1e] dark:hover:text-[#f5f5f7]"
        >
          <HistoryIcon
            size={18}
            className={isOpen == true ? "hidden" : "block"}
          />
          <CrossIcon
            size={18}
            className={isOpen == false ? "hidden " : "block  rotate-45"}
          />{" "}
        </button>
      </div>

      {/* Chat list — only rendered when expanded, since collapsed rail has no room for it */}
      {isOpen && (
        <div className="flex flex-1 flex-col gap-1 overflow-y-auto px-2 pb-2">
          {loading ? (
            <p className="px-2 py-4 text-center text-sm text-[#6b6b73] dark:text-[#8a8a92]">
              Loading...
            </p>
          ) : history.length === 0 ? (
            <p className="px-2 py-4 text-center text-sm text-[#6b6b73] dark:text-[#8a8a92]">
              No past chats yet
            </p>
          ) : (
            history.map((chat) => (
              <div
                key={chat._id}
                className="group flex items-center justify-between rounded-lg hover:bg-[#eaeaec] dark:hover:bg-[#22222a]"
              >
                <button
                  onClick={() => onSelectChat(chat._id)}
                  className="flex-1 truncate px-3 py-2 text-left text-sm text-[#1a1a1e] dark:text-[#d4d4d8]"
                >
                  {chat.title}
                </button>
                <button
                  onClick={(e) => handleDelete(e, chat._id)}
                  aria-label="Rename"
                  className="mr-0.5 flex h-7 w-7 items-center justify-center rounded-md text-[#6b6b73] opacity-0 transition group-hover:opacity-100 hover:bg-green-500/10 dark:text-[#8a8a92]"
                >
                  <Edit size={14} />
                </button>
                <button
                  onClick={(e) => handleDelete(e, chat._id)}
                  aria-label="Delete chat"
                  className="mr-2 flex h-7 w-7 items-center justify-center rounded-md text-[#6b6b73] opacity-0 transition group-hover:opacity-100 hover:bg-red-500/10 dark:text-[#8a8a92]"
                >
                  <TrashIcon size={14} />
                </button>
              </div>
            ))
          )}
        </div>
      )}

      <div className="mt-auto border-t border-[#e5e5e8] p-2 dark:border-[#26262c]">
        <button
          onClick={logout}
          aria-label="Logout"
          title="Logout"
          className="flex h-10 w-10 items-center justify-center rounded-lg text-[#6b6b73] dark:text-[#8a8a92] transition hover:bg-[#eaeaec] dark:hover:bg-[#22222a] hover:text-[#1a1a1e] dark:hover:text-[#f5f5f7]"
        >
          <LogOutIcon size={18} />
        </button>
      </div>
    </aside>
  );
}
