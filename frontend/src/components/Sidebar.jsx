import { useEffect, useMemo, useState } from "react";
import {
  Check,
  ChevronDown,
  Edit,
  HistoryIcon,
  LogOutIcon,
  PlusIcon,
  Star,
  TrashIcon,
  X,
} from "lucide-react";

import {
  deleteChatMessages,
  getChats,
  renameChat,
  toggleChatStar,
} from "../api/chat";

import { AuthProvider } from "../context/AuthContext";

export default function Sidebar({
  isOpen,
  isMobile,
  onToggle,
  onSelectChat,
  onNewChat,
  onChatSelected,
  selectedChatId,
}) {
  const { logout } = AuthProvider.useAuth();

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [draftTitle, setDraftTitle] = useState("");

  const [deleteChatId, setDeleteChatId] = useState(null);
  const [deleteChatTitle, setDeleteChatTitle] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const [showStarred, setShowStarred] = useState(true);
  const [updatingStarId, setUpdatingStarId] = useState(null);

  useEffect(() => {
    if (!isOpen) return;

    let active = true;

    const fetchChats = async () => {
      setLoading(true);

      try {
        const chats = await getChats();
        setHistory(Array.isArray(chats) ? chats : []);
      } catch (err) {
        console.error("Failed to load chats:", err);
        if (active) setHistory([]);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchChats();

    return () => {
      active = false;
    };
  }, [isOpen]);

  const starredChats = useMemo(
    () => history.filter((chat) => chat.starred),
    [history],
  );

  const normalChats = useMemo(
    () => history.filter((chat) => !chat.starred),
    [history],
  );

  const handleDelete = (e, chat) => {
    e.stopPropagation();

    setDeleteChatId(chat._id);
    setDeleteChatTitle(chat.title);
  };

  const confirmDelete = async () => {
    if (!deleteChatId || isDeleting) return;

    setIsDeleting(true);

    try {
      await deleteChatMessages(deleteChatId);

      setHistory((prev) => prev.filter((chat) => chat._id !== deleteChatId));

      if (selectedChatId === deleteChatId) {
        onNewChat();
      }

      setDeleteChatId(null);
      setDeleteChatTitle("");
    } catch (err) {
      console.error("Failed to delete chat:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDelete = () => {
    if (isDeleting) return;

    setDeleteChatId(null);
    setDeleteChatTitle("");
  };

  const startEditing = (e, chat) => {
    e.stopPropagation();

    setEditingId(chat._id);
    setDraftTitle(chat.title);
  };

  const cancelEditing = (e) => {
    e?.stopPropagation();

    setEditingId(null);
    setDraftTitle("");
  };

  const confirmRename = async (e, chatId) => {
    e.stopPropagation();

    const trimmed = draftTitle.trim();
    const currentTitle = history.find((chat) => chat._id === chatId)?.title;

    if (!trimmed || trimmed === currentTitle) {
      cancelEditing();
      return;
    }

    try {
      const updated = await renameChat(chatId, trimmed);

      setHistory((prev) =>
        prev.map((chat) =>
          chat._id === chatId ? { ...chat, title: updated.title } : chat,
        ),
      );
    } catch (err) {
      console.error("Failed to rename chat:", err);
    } finally {
      cancelEditing();
    }
  };

  const handleTitleKeyDown = (e, chatId) => {
    if (e.key === "Enter") {
      confirmRename(e, chatId);
    }

    if (e.key === "Escape") {
      cancelEditing(e);
    }
  };

  const handleStar = async (e, chat) => {
    e.stopPropagation();

    if (updatingStarId) return;

    // Optimistic update
    setHistory((prev) =>
      prev.map((item) =>
        item._id === chat._id ? { ...item, starred: !item.starred } : item,
      ),
    );

    setUpdatingStarId(chat._id);

    try {
      const updated = await toggleChatStar(chat._id);

      setHistory((prev) =>
        prev.map((item) =>
          item._id === chat._id ? { ...item, starred: updated.starred } : item,
        ),
      );
    } catch (err) {
      // Roll back optimistic update
      setHistory((prev) =>
        prev.map((item) =>
          item._id === chat._id ? { ...item, starred: chat.starred } : item,
        ),
      );

      console.error("Failed to update starred state:", err);
    } finally {
      setUpdatingStarId(null);
    }
  };

  const renderChat = (chat) => {
    const isEditing = editingId === chat._id;
    const isSelected = selectedChatId === chat._id;
    const isStarUpdating = updatingStarId === chat._id;

    return (
      <div
        key={chat._id}
        className={`
          group flex min-w-0 items-center gap-1 rounded-xl
          transition-colors
          ${
            isSelected
              ? "bg-[#fff3eb] dark:bg-[#ff7a18]/10"
              : "hover:bg-[#f3f4f6] dark:hover:bg-[#202026]"
          }
        `}
      >
        {isEditing ? (
          <div className="flex min-w-0 flex-1 items-center gap-1 px-1">
            <input
              autoFocus
              value={draftTitle}
              onChange={(e) => setDraftTitle(e.target.value)}
              onKeyDown={(e) => handleTitleKeyDown(e, chat._id)}
              onClick={(e) => e.stopPropagation()}
              className="
                min-w-0 flex-1 rounded-lg
                border border-[#ff7a18]
                bg-white px-3 py-1.5 text-sm
                text-[#111827] outline-none
                dark:bg-[#0f0f12] dark:text-[#f5f5f7]
              "
            />

            <button
              type="button"
              onClick={(e) => confirmRename(e, chat._id)}
              aria-label="Confirm rename"
              className="
                flex h-7 w-7 shrink-0 items-center justify-center
                rounded-lg text-green-600
                hover:bg-green-500/10
              "
            >
              <Check size={14} />
            </button>

            <button
              type="button"
              onClick={cancelEditing}
              aria-label="Cancel rename"
              className="
                flex h-7 w-7 shrink-0 items-center justify-center
                rounded-lg text-[#6b7280]
                hover:bg-[#e5e7eb]
                dark:text-[#9ca3af]
                dark:hover:bg-[#28282f]
              "
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <>
            <button
              type="button"
              onClick={() => {
                onSelectChat(chat._id);
                onChatSelected?.();
              }}
              className="
                min-w-0 flex-1 truncate px-2 py-2.5
                text-left text-sm
                font-medium
                text-[#374151]
                dark:text-[#d4d4d8]
              "
              title={chat.title}
            >
              {chat.title}
            </button>

            <div
              className="
    flex items-center gap-0.5 pr-1
    opacity-100
    transition-opacity
    md:opacity-0
    md:group-hover:opacity-100
    md:group-focus-within:opacity-100
  "
            >
              <button
                type="button"
                onClick={(e) => handleStar(e, chat)}
                disabled={isStarUpdating}
                aria-label={chat.starred ? "Unstar chat" : "Star chat"}
                title={chat.starred ? "Unstar" : "Star"}
                className={`
                  flex h-8 w-8 md:h-7 md:w-7
  items-center justify-center
  rounded-lg transition
                  ${
                    chat.starred
                      ? "text-yellow-500 hover:bg-yellow-500/10"
                      : "text-[#9ca3af] hover:bg-yellow-500/10 hover:text-yellow-500"
                  }
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                `}
              >
                <Star size={14} fill={chat.starred ? "currentColor" : "none"} />
              </button>

              <button
                type="button"
                onClick={(e) => startEditing(e, chat)}
                aria-label="Rename chat"
                title="Rename"
                className="
  flex h-8 w-8 md:h-7 md:w-7
  items-center justify-center
  rounded-lg text-[#9ca3af]
  transition
  hover:bg-green-500/10
  hover:text-green-600
  dark:text-[#8a8a92]
"
              >
                <Edit size={14} />
              </button>

              <button
                type="button"
                onClick={(e) => handleDelete(e, chat)}
                aria-label="Delete chat"
                title="Delete"
                className="
  flex h-8 w-8 md:h-7 md:w-7
  items-center justify-center
  rounded-lg text-[#9ca3af]
  transition
  hover:bg-red-500/10
  hover:text-red-500
  dark:text-[#8a8a92]
"
              >
                <TrashIcon size={14} />
              </button>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <>
      {isMobile && isOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={onToggle}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      <aside
        className={`
    flex h-full min-h-0 shrink-0 flex-col
    border-r border-[#e5e7eb]
    bg-white
    dark:border-[#26262c] dark:bg-[#141418]
    transition-all duration-300 ease-in-out

    ${
      isMobile
        ? isOpen
          ? "absolute left-0 top-0 z-50 h-full w-72"
          : "relative z-50 w-14"
        : isOpen
          ? "relative w-72"
          : "relative w-16"
    }
  `}
      >
        {/* Top controls */}

        <div className="flex flex-col  gap-1.5 p-2">
          <button
            type="button"
            onClick={() => {
              onNewChat();
              onChatSelected?.();
            }}
            aria-label="New chat"
            title="New chat"
            className="
      flex h-10 w-full items-center gap-2 rounded-xl px-3
      text-[#4b5563]
      transition
      hover:bg-[#f3f4f6] hover:text-[#111827]
      dark:text-[#d4d4d8]
      dark:hover:bg-[#22222a]
      dark:hover:text-white
    "
          >
            <PlusIcon size={18} className="shrink-0" />

            {isOpen && (
              <span className="whitespace-nowrap text-sm font-medium">
                New Chat
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={onToggle}
            aria-label={isOpen ? "Close history" : "Open history"}
            title={isOpen ? "Close history" : "History"}
            className="
      flex h-10 w-full items-center gap-2 rounded-xl px-3
      text-[#4b5563]
      transition
      hover:bg-[#f3f4f6] hover:text-[#111827]
      dark:text-[#d4d4d8]
      dark:hover:bg-[#22222a]
      dark:hover:text-white
    "
          >
            {isOpen ? (
              <X size={18} className="shrink-0" />
            ) : (
              <HistoryIcon size={18} className="shrink-0" />
            )}

            {isOpen && (
              <span className="whitespace-nowrap text-sm font-medium">
                History
              </span>
            )}
          </button>
        </div>

        {isOpen && (
          <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-3">
            {loading ? (
              <div className="px-2 py-8 text-center text-sm text-[#6b7280] dark:text-[#8a8a92]">
                Loading chats...
              </div>
            ) : (
              <>
                {/* Starred */}
                <section>
                  <button
                    type="button"
                    onClick={() => setShowStarred((prev) => !prev)}
                    className="
                    flex w-full items-center justify-between
                    rounded-lg px-2 py-2
                    text-xs font-semibold uppercase tracking-wide
                    text-[#9ca3af]
                    transition hover:text-[#4b5563]
                    dark:text-[#71717a] dark:hover:text-[#d4d4d8]
                  "
                  >
                    <span className="flex items-center gap-2">
                      <Star size={13} fill="currentColor" />
                      Starred
                      {starredChats.length > 0 && (
                        <span className="text-[10px]">
                          {starredChats.length}
                        </span>
                      )}
                    </span>

                    <ChevronDown
                      size={14}
                      className={`
                      transition-transform duration-200
                      ${showStarred ? "" : "-rotate-90"}
                    `}
                    />
                  </button>

                  {showStarred && (
                    <div className="space-y-0.5">
                      {starredChats.length === 0 ? (
                        <p className="px-3 py-2 text-xs text-[#9ca3af] dark:text-[#71717a]">
                          No starred chats
                        </p>
                      ) : (
                        starredChats.map(renderChat)
                      )}
                    </div>
                  )}
                </section>

                {/* Recent chats */}
                <section className="mt-4">
                  <div className="px-2 pb-2 text-xs font-semibold uppercase tracking-wide text-[#9ca3af] dark:text-[#71717a]">
                    Recent
                  </div>

                  {normalChats.length === 0 ? (
                    <p className="px-3 py-2 text-xs text-[#9ca3af] dark:text-[#71717a]">
                      No other chats
                    </p>
                  ) : (
                    <div className="space-y-0.5">
                      {normalChats.map(renderChat)}
                    </div>
                  )}
                </section>
              </>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="mt-auto shrink-0 border-t border-[#e5e7eb] p-2 dark:border-[#26262c]">
          {" "}
          <button
            type="button"
            onClick={logout}
            aria-label="Logout"
            title="Logout"
            className="
            flex h-10 w-full items-center gap-2 rounded-xl px-3
            text-red-500 transition
            hover:bg-red-50
            dark:text-red-400
            dark:hover:bg-red-500/10
          "
          >
            <LogOutIcon size={18} className="shrink-0" />

            {isOpen && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>

        {/* Delete modal */}
        {deleteChatId && (
          <div
            className="
            fixed inset-0 z-[100]
            flex items-center justify-center
            bg-black/40 px-4
            backdrop-blur-sm
          "
            onClick={cancelDelete}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="delete-chat-title"
              onClick={(e) => e.stopPropagation()}
              className="
              w-full max-w-md rounded-2xl
              border border-[#e5e7eb]
              bg-white p-6
              shadow-[0_24px_80px_rgba(0,0,0,0.18)]
              dark:border-[#2a2a32]
              dark:bg-[#18181d]
              dark:shadow-[0_24px_80px_rgba(0,0,0,0.5)]
            "
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-red-500/10">
                <TrashIcon size={20} className="text-red-500" />
              </div>

              <h2
                id="delete-chat-title"
                className="text-lg font-semibold text-[#111827] dark:text-[#f5f5f7]"
              >
                Delete chat?
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#6b7280] dark:text-[#8a8a92]">
                Are you sure you want to delete{" "}
                <span className="font-medium text-[#111827] dark:text-[#f5f5f7]">
                  "{deleteChatTitle}"
                </span>
                ?
                <br />
                This action cannot be undone.
              </p>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={cancelDelete}
                  disabled={isDeleting}
                  className="
                  rounded-lg px-4 py-2
                  text-sm font-medium
                  text-[#6b7280]
                  transition
                  hover:bg-[#f3f4f6]
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                  dark:text-[#a1a1aa]
                  dark:hover:bg-[#26262c]
                "
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="
                  min-w-[90px] rounded-lg
                  bg-red-500 px-4 py-2
                  text-sm font-medium text-white
                  transition hover:bg-red-600
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
