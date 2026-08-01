import { useState, useEffect } from "react";
import { getChats } from "../api/chat";

export default function Sidebar({ isOpen, onClose, onSelectChat }) {
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

  return (
    <>
      {isOpen && (
        <div onClick={onClose} className="fixed inset-0 z-[998] bg-black/50 md:hidden" />
      )}

      <aside
        className={`
          fixed left-0 top-0 z-[999] h-full w-[280px]
          border-r border-[#e5e5e8] dark:border-[#26262c]
          bg-white dark:bg-[#141418]
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex items-center justify-between border-b border-[#e5e5e8] dark:border-[#26262c] px-5 py-4">
          <h2 className="text-lg font-semibold text-[#1a1a1e] dark:text-[#f5f5f7]">History</h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#6b6b73] dark:text-[#8a8a92] transition hover:bg-[#eaeaec] dark:hover:bg-[#22222a]"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col gap-1 overflow-y-auto p-3">
          {loading ? (
            <p className="px-2 py-4 text-center text-sm text-[#6b6b73] dark:text-[#8a8a92]">Loading...</p>
          ) : history.length === 0 ? (
            <p className="px-2 py-4 text-center text-sm text-[#6b6b73] dark:text-[#8a8a92]">No past chats yet</p>
          ) : (
            history.map((chat) => (
              <button
                key={chat._id}
                onClick={() => onSelectChat(chat._id)}
                className="truncate rounded-lg px-3 py-2 text-left text-sm text-[#1a1a1e] dark:text-[#d4d4d8] transition duration-150 hover:bg-[#eaeaec] dark:hover:bg-[#22222a]"
              >
                {chat.title}
              </button>
            ))
          )}
        </div>
      </aside>
    </>
  );
}