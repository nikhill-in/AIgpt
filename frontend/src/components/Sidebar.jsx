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
  onToggle,
  onSelectChat,
  onNewChat,
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
        if (active) setHistory(chats);
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

      setHistory((prev) =>
        prev.filter((chat) => chat._id !== deleteChatId),
      );

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
    const currentTitle = history.find(
      (chat) => chat._id === chatId,
    )?.title;

    if (!trimmed || trimmed === currentTitle) {
      cancelEditing();
      return;
    }

    try {
      const updated = await renameChat(chatId, trimmed);

      setHistory((prev) =>
        prev.map((chat) =>
          chat._id === chatId
            ? { ...chat, title: updated.title }
            : chat,
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
        item._id === chat._id
          ? { ...item, starred: !item.starred }
          : item,
      ),
    );

    setUpdatingStarId(chat._id);

    try {
      const updated = await toggleChatStar(chat._id);

      setHistory((prev) =>
        prev.map((item) =>
          item._id === chat._id
            ? { ...item, starred: updated.starred }
            : item,
        ),
      );
    } catch (err) {
      // Roll back optimistic update
      setHistory((prev) =>
        prev.map((item) =>
          item._id === chat._id
            ? { ...item, starred: chat.starred }
            : item,
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
              onClick={() => onSelectChat(chat._id)}
              className="
                min-w-0 flex-1 truncate px-3 py-2.5
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
                opacity-0 transition-opacity
                group-hover:opacity-100
                group-focus-within:opacity-100
              "
            >
              <button
                type="button"
                onClick={(e) => handleStar(e, chat)}
                disabled={isStarUpdating}
                aria-label={
                  chat.starred ? "Unstar chat" : "Star chat"
                }
                title={chat.starred ? "Unstar" : "Star"}
                className={`
                  flex h-7 w-7 items-center justify-center
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
                <Star
                  size={14}
                  fill={chat.starred ? "currentColor" : "none"}
                />
              </button>

              <button
                type="button"
                onClick={(e) => startEditing(e, chat)}
                aria-label="Rename chat"
                title="Rename"
                className="
                  flex h-7 w-7 items-center justify-center
                  rounded-lg text-[#9ca3af]
                  transition hover:bg-green-500/10
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
                  flex h-7 w-7 items-center justify-center
                  rounded-lg text-[#9ca3af]
                  transition hover:bg-red-500/10
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
    <aside
      className={`
        flex h-screen shrink-0 flex-col justify-between
        border-r border-[#e5e7eb]
        bg-white
        dark:border-[#26262c] dark:bg-[#141418]
        transition-[width] duration-300 ease-in-out
        ${isOpen ? "w-72" : "w-16"}
      `}
    >
      {/* Top controls */}
      <div className="flex flex-col gap-1.5 p-2">
        <button
          type="button"
          onClick={onNewChat}
          aria-label="New chat"
          title="New chat"
          className="
            flex h-10 items-center gap-2 rounded-xl px-3
            text-[#4b5563]
            transition
            hover:bg-[#f3f4f6] hover:text-[#111827]
            dark:text-[#9ca3af]
            dark:hover:bg-[#22222a] dark:hover:text-white
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
          aria-label={isOpen ? "Close sidebar" : "Open history"}
          title={isOpen ? "Close sidebar" : "History"}
          className="
            flex h-10 items-center gap-2 rounded-xl px-3
            text-[#4b5563]
            transition
            hover:bg-[#f3f4f6] hover:text-[#111827]
            dark:text-[#9ca3af]
            dark:hover:bg-[#22222a] dark:hover:text-white
          "
        >
          {isOpen ? (
            <X size={18} className="shrink-0" />
          ) : (
            <HistoryIcon size={18} className="shrink-0" />
          )}

          {isOpen && (
            <span className="text-sm font-medium">History</span>
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
      <div className="border-t border-[#e5e7eb] p-2 dark:border-[#26262c]">
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

          {isOpen && (
            <span className="text-sm font-medium">
              Logout
            </span>
          )}
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
  );
}



// import { useState, useEffect } from "react";
// import {
//   PlusIcon,
//   HistoryIcon,
//   LogOutIcon,
//   TrashIcon,
//   Edit,
//   Check,
//   X,
// } from "lucide-react";
// import { deleteChatMessages, getChats, renameChat } from "../api/chat";
// import { AuthProvider } from "../context/AuthContext";

// export default function Sidebar({
//   isOpen,
//   onToggle,
//   onSelectChat,
//   onNewChat,
//   selectedChatId,
// }) {
//   const { logout } = AuthProvider.useAuth();

//   const [history, setHistory] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [editingId, setEditingId] = useState(null);
//   const [draftTitle, setDraftTitle] = useState("");
//   const [deleteChatId, setDeleteChatId] = useState(null);
//   const [deleteChatTitle, setDeleteChatTitle] = useState("");
//   const [isDeleting, setIsDeleting] = useState(false);

//   useEffect(() => {
//     if (!isOpen) return;

//     setLoading(true);

//     getChats()
//       .then(setHistory)
//       .catch(() => setHistory([]))
//       .finally(() => setLoading(false));
//   }, [isOpen]);

//   const handleDelete = (e, chat) => {
//     e.stopPropagation();

//     setDeleteChatId(chat._id);
//     setDeleteChatTitle(chat.title);
//   };

//   const confirmDelete = async () => {
//     if (!deleteChatId || isDeleting) return;

//     setIsDeleting(true);

//     try {
//       await deleteChatMessages(deleteChatId);

//       setHistory((prev) => prev.filter((chat) => chat._id !== deleteChatId));

//       if (selectedChatId === deleteChatId) {
//         onNewChat();
//       }

//       setDeleteChatId(null);
//       setDeleteChatTitle("");
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setIsDeleting(false);
//     }
//   };

//   const cancelDelete = () => {
//     if (isDeleting) return;

//     setDeleteChatId(null);
//     setDeleteChatTitle("");
//   };

//   const startEditing = (e, chat) => {
//     e.stopPropagation();
//     setEditingId(chat._id);
//     setDraftTitle(chat.title);
//   };

//   const cancelEditing = (e) => {
//     e?.stopPropagation();
//     setEditingId(null);
//     setDraftTitle("");
//   };

//   const confirmRename = async (e, chatId) => {
//     e.stopPropagation();

//     const trimmed = draftTitle.trim();

//     if (!trimmed || trimmed === history.find((c) => c._id === chatId)?.title) {
//       cancelEditing();
//       return;
//     }

//     try {
//       const updated = await renameChat(chatId, trimmed);

//       setHistory((prev) =>
//         prev.map((chat) =>
//           chat._id === chatId ? { ...chat, title: updated.title } : chat,
//         ),
//       );
//     } catch (err) {
//       console.error(err);
//     } finally {
//       cancelEditing();
//     }
//   };

//   const handleTitleKeyDown = (e, chatId) => {
//     if (e.key === "Enter") {
//       confirmRename(e, chatId);
//     }

//     if (e.key === "Escape") {
//       cancelEditing(e);
//     }
//   };

//   return (
//     <aside
//       className={`
//         flex h-screen flex-col border-r border-[#e5e5e8] dark:border-[#26262c]
//         bg-white dark:bg-[#141418]
//         transition-all duration-300 ease-in-out
//         ${isOpen ? "w-72" : "w-16"}
//       `}
//     >
//       <div className={`flex gap-1 p-2 flex-col`}>
//         <button
//           onClick={onNewChat}
//           aria-label="New chat"
//           title="New chat" 
//           className="flex h-10 items-center gap-2 rounded-lg px-3 text-[#6b6b73] transition hover:bg-[#eaeaec] hover:text-[#1a1a1e] dark:text-[#8a8a92] dark:hover:bg-[#22222a] dark:hover:text-[#f5f5f7]"
//         >
//           <PlusIcon size={18} className="shrink-0" />

//           {isOpen && <span className="whitespace-nowrap">New Chat</span>}
//         </button>

//         <button
//           onClick={onToggle}
//           aria-label="Toggle history"
//           title="History"
//           className="flex h-10 w-10 items-center justify-center rounded-lg text-[#6b6b73] dark:text-[#8a8a92] transition hover:bg-[#eaeaec] dark:hover:bg-[#22222a] hover:text-[#1a1a1e] dark:hover:text-[#f5f5f7]"
//         >
//           {isOpen ? <X size={18} /> : <HistoryIcon size={18} />}
//         </button>
//       </div>

//       {isOpen && (
//         <div className="flex flex-1 flex-col gap-1 overflow-y-auto px-2 pb-2">
//           {loading ? (
//             <p className="px-2 py-4 text-center text-sm text-[#6b6b73] dark:text-[#8a8a92]">
//               Loading...
//             </p>
//           ) : history.length === 0 ? (
//             <p className="px-2 py-4 text-center text-sm text-[#6b6b73] dark:text-[#8a8a92]">
//               No past chats yet
//             </p>
//           ) : (
//             history.map((chat) => {
//               const isEditing = editingId === chat._id;
//               const isSelected = selectedChatId === chat._id;

//               return (
//                 <div
//                   key={chat._id}
//                   className={`
//                     group flex items-center justify-between rounded-lg
//                     ${
//                       isSelected
//                         ? "bg-[#eaeaec] dark:bg-[#22222a]"
//                         : "hover:bg-[#eaeaec] dark:hover:bg-[#22222a]"
//                     }
//                   `}
//                 >
//                   {isEditing ? (
//                     <input
//                       autoFocus
//                       value={draftTitle}
//                       onChange={(e) => setDraftTitle(e.target.value)}
//                       onKeyDown={(e) => handleTitleKeyDown(e, chat._id)}
//                       onClick={(e) => e.stopPropagation()}
//                       className="
//                         flex-1 rounded-md border border-[#ff7a18]
//                         bg-white dark:bg-[#0a0a0c]
//                         px-3 py-1.5 text-sm
//                         text-[#1a1a1e] dark:text-[#f5f5f7]
//                         outline-none
//                       "
//                     />
//                   ) : (
//                     <button
//                       onClick={() => onSelectChat(chat._id)}
//                       className="flex-1 truncate px-3 py-2 text-left text-sm text-[#1a1a1e] dark:text-[#d4d4d8]"
//                     >
//                       {chat.title}
//                     </button>
//                   )}

//                   {isEditing ? (
//                     <>
//                       <button
//                         onClick={(e) => confirmRename(e, chat._id)}
//                         aria-label="Confirm rename"
//                         className="mr-0.5 flex h-7 w-7 items-center justify-center rounded-md text-green-600 hover:bg-green-500/10"
//                       >
//                         <Check size={14} />
//                       </button>

//                       <button
//                         onClick={cancelEditing}
//                         aria-label="Cancel rename"
//                         className="mr-2 flex h-7 w-7 items-center justify-center rounded-md text-[#6b6b73] hover:bg-[#eaeaec] dark:text-[#8a8a92] dark:hover:bg-[#22222a]"
//                       >
//                         <X size={14} />
//                       </button>
//                     </>
//                   ) : (
//                     <>
//                       <button
//                         onClick={(e) => startEditing(e, chat)}
//                         aria-label="Rename chat"
//                         className="mr-0.5 flex h-7 w-7 items-center justify-center rounded-md text-[#6b6b73] opacity-0 transition group-hover:opacity-100 hover:bg-green-500/10 dark:text-[#8a8a92]"
//                       >
//                         <Edit size={14} />
//                       </button>

//                       <button
//                         onClick={(e) => handleDelete(e, chat)}
//                         aria-label="Delete chat"
//                         className="mr-2 flex h-7 w-7 items-center justify-center rounded-md text-[#6b6b73] opacity-0 transition group-hover:opacity-100 hover:bg-red-500/10 dark:text-[#8a8a92]"
//                       >
//                         <TrashIcon size={14} />
//                       </button>
//                     </>
//                   )}
//                 </div>
//               );
//             })
//           )}
//         </div>
//       )}

//       <div className="mt-auto  border-t border-[#e5e5e8] p-1.5 dark:border-[#26262c]">
//         <button
//           onClick={logout}
//           aria-label="Logout"
//           title="Logout"
//           className="flex h-11 w-10 items-center justify-center rounded-lg text-[#6b6b73] dark:text-[#8a8a92] transition hover:bg-[#eaeaec] dark:hover:bg-[#22222a] hover:text-[#1a1a1e] dark:hover:text-[#f5f5f7]"
//         >
//           <LogOutIcon size={18} />
//         </button>
//       </div>

//       {deleteChatId && (
//         <div
//           className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
//           onClick={cancelDelete}
//         >
//           <div
//             onClick={(e) => e.stopPropagation()}
//             className="
//         w-full max-w-md
//         rounded-2xl
//         border border-[#e5e5e8]
//         bg-white
//         p-6
//         shadow-2xl
//         dark:border-[#2a2a32]
//         dark:bg-[#18181d]
//       "
//           >
//             {/* Icon */}
//             <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-red-500/10">
//               <TrashIcon size={20} className="text-red-500" />
//             </div>

//             {/* Heading */}
//             <h2 className="text-lg font-semibold text-[#1a1a1e] dark:text-[#f5f5f7]">
//               Delete chat?
//             </h2>

//             {/* Description */}
//             <p className="mt-2 text-sm leading-6 text-[#6b6b73] dark:text-[#8a8a92]">
//               Are you sure you want to delete{" "}
//               <span className="font-medium text-[#1a1a1e] dark:text-[#f5f5f7]">
//                 "{deleteChatTitle}"
//               </span>
//               ?
//               <br />
//               This action cannot be undone.
//             </p>

//             {/* Buttons */}
//             <div className="mt-6 flex justify-end gap-3">
//               <button
//                 onClick={cancelDelete}
//                 disabled={isDeleting}
//                 className="
//             rounded-lg
//             px-4 py-2
//             text-sm font-medium
//             text-[#6b6b73]
//             transition
//             hover:bg-[#eaeaec]
//             disabled:cursor-not-allowed
//             disabled:opacity-50
//             dark:text-[#a1a1aa]
//             dark:hover:bg-[#26262c]
//           "
//               >
//                 Cancel
//               </button>

//               <button
//                 onClick={confirmDelete}
//                 disabled={isDeleting}
//                 className="
//             flex min-w-[90px]
//             items-center justify-center
//             rounded-lg
//             bg-red-500
//             px-4 py-2
//             text-sm font-medium
//             text-white
//             transition
//             hover:bg-red-600
//             disabled:cursor-not-allowed
//             disabled:opacity-60
//           "
//               >
//                 {isDeleting ? "Deleting..." : "Delete"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </aside>
//   );
// }
