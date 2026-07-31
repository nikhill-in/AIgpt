import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Sidebar({ isOpen, onClose, onSelectChat }) {
  const { isLoggedIn, user } = useAuth();

  // TODO: replace with real fetch from your backend, e.g.
  // useEffect(() => { fetch(`${API_URL}/chats`).then(...) }, [user])
  const [history] = useState([
    { id: 1, title: "Landing page copy ideas" },
    { id: 2, title: "React auth context help" },
    { id: 3, title: "Sidebar UI component" },
  ]);

  if (!isLoggedIn) return null;

  return (
    <>
      {/* Overlay - closes sidebar on outside click, mobile-friendly */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-[998] bg-black/50 md:hidden"
        />
      )}

      <aside
        className={`
          fixed left-0 top-0 z-[999] h-full w-[280px]
          border-r border-[#26262c] bg-[#141418]
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex items-center justify-between border-b border-[#26262c] px-5 py-4">
          <h2 className="text-lg font-semibold text-[#f5f5f7]">History</h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#8a8a92] transition hover:bg-[#22222a] hover:text-[#f5f5f7]"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col gap-1 overflow-y-auto p-3">
          {history.length === 0 ? (
            <p className="px-2 py-4 text-center text-sm text-[#8a8a92]">
              No past chats yet
            </p>
          ) : (
            history.map((chat) => (
              <button
                key={chat.id}
                onClick={() => onSelectChat(chat.id)}
                className="
                  truncate rounded-lg px-3 py-2 text-left text-sm text-[#d4d4d8]
                  transition duration-150
                  hover:bg-[#22222a] hover:text-[#f5f5f7]
                "
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