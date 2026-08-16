import { useState, useEffect } from "react";
import {
  PlusIcon,
  HistoryIcon,
  LogOutIcon,
  TrashIcon,
  Edit,
  Check,
  X,
} from "lucide-react";
import { deleteChatMessages, getChats, renameChat } from "../api/chat";
import { useAuth } from "../context/AuthContext";

export default function Sidebar({
  isOpen,
  onToggle,
  onSelectChat,
  onNewChat,
  selectedChatId,
}) {
  const { logout } = useAuth();

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [draftTitle, setDraftTitle] = useState("");
  const [deleteChatId, setDeleteChatId] = useState(null);
  const [deleteChatTitle, setDeleteChatTitle] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    setLoading(true);

    getChats()
      .then(setHistory)
      .catch(() => setHistory([]))
      .finally(() => setLoading(false));
  }, [isOpen]);

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
      console.error(err);
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

    if (!trimmed || trimmed === history.find((c) => c._id === chatId)?.title) {
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
      console.error(err);
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

  return (
    <aside
      className={`
        flex h-screen flex-col border-r border-[#e5e5e8] dark:border-[#26262c]
        bg-white dark:bg-[#141418]
        transition-all duration-300 ease-in-out
        ${isOpen ? "w-72" : "w-16"}
      `}
    >
      <div className="flex flex-col gap-1 p-2 mx-auto">
        <button
          onClick={onNewChat}
          aria-label="New chat"
          title="New chat"
          className="flex h-10 items-center gap-2 rounded-lg px-3 text-[#6b6b73] transition hover:bg-[#eaeaec] hover:text-[#1a1a1e] dark:text-[#8a8a92] dark:hover:bg-[#22222a] dark:hover:text-[#f5f5f7]"
        >
          <PlusIcon size={18} className="shrink-0" />

          {isOpen && <span className="whitespace-nowrap">New Chat</span>}
        </button>

        <button
          onClick={onToggle}
          aria-label="Toggle history"
          title="History"
          className="flex h-10 w-10 items-center justify-center rounded-lg text-[#6b6b73] dark:text-[#8a8a92] transition hover:bg-[#eaeaec] dark:hover:bg-[#22222a] hover:text-[#1a1a1e] dark:hover:text-[#f5f5f7]"
        >
          {isOpen ? <X size={18} /> : <HistoryIcon size={18} />}
        </button>
      </div>

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
            history.map((chat) => {
              const isEditing = editingId === chat._id;
              const isSelected = selectedChatId === chat._id;

              return (
                <div
                  key={chat._id}
                  className={`
                    group flex items-center justify-between rounded-lg
                    ${
                      isSelected
                        ? "bg-[#eaeaec] dark:bg-[#22222a]"
                        : "hover:bg-[#eaeaec] dark:hover:bg-[#22222a]"
                    }
                  `}
                >
                  {isEditing ? (
                    <input
                      autoFocus
                      value={draftTitle}
                      onChange={(e) => setDraftTitle(e.target.value)}
                      onKeyDown={(e) => handleTitleKeyDown(e, chat._id)}
                      onClick={(e) => e.stopPropagation()}
                      className="
                        flex-1 rounded-md border border-[#ff7a18]
                        bg-white dark:bg-[#0a0a0c]
                        px-3 py-1.5 text-sm
                        text-[#1a1a1e] dark:text-[#f5f5f7]
                        outline-none
                      "
                    />
                  ) : (
                    <button
                      onClick={() => onSelectChat(chat._id)}
                      className="flex-1 truncate px-3 py-2 text-left text-sm text-[#1a1a1e] dark:text-[#d4d4d8]"
                    >
                      {chat.title}
                    </button>
                  )}

                  {isEditing ? (
                    <>
                      <button
                        onClick={(e) => confirmRename(e, chat._id)}
                        aria-label="Confirm rename"
                        className="mr-0.5 flex h-7 w-7 items-center justify-center rounded-md text-green-600 hover:bg-green-500/10"
                      >
                        <Check size={14} />
                      </button>

                      <button
                        onClick={cancelEditing}
                        aria-label="Cancel rename"
                        className="mr-2 flex h-7 w-7 items-center justify-center rounded-md text-[#6b6b73] hover:bg-[#eaeaec] dark:text-[#8a8a92] dark:hover:bg-[#22222a]"
                      >
                        <X size={14} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={(e) => startEditing(e, chat)}
                        aria-label="Rename chat"
                        className="mr-0.5 flex h-7 w-7 items-center justify-center rounded-md text-[#6b6b73] opacity-0 transition group-hover:opacity-100 hover:bg-green-500/10 dark:text-[#8a8a92]"
                      >
                        <Edit size={14} />
                      </button>

                      <button
                        onClick={(e) => handleDelete(e, chat)}
                        aria-label="Delete chat"
                        className="mr-2 flex h-7 w-7 items-center justify-center rounded-md text-[#6b6b73] opacity-0 transition group-hover:opacity-100 hover:bg-red-500/10 dark:text-[#8a8a92]"
                      >
                        <TrashIcon size={14} />
                      </button>
                    </>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      <div className="mt-auto mx-auto border-t border-[#e5e5e8] p-1.5 dark:border-[#26262c]">
        <button
          onClick={logout}
          aria-label="Logout"
          title="Logout"
          className="flex h-11 w-10 items-center justify-center rounded-lg text-[#6b6b73] dark:text-[#8a8a92] transition hover:bg-[#eaeaec] dark:hover:bg-[#22222a] hover:text-[#1a1a1e] dark:hover:text-[#f5f5f7]"
        >
          <LogOutIcon size={18} />
        </button>
      </div>

      {deleteChatId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
          onClick={cancelDelete}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="
        w-full max-w-md
        rounded-2xl
        border border-[#e5e5e8]
        bg-white
        p-6
        shadow-2xl
        dark:border-[#2a2a32]
        dark:bg-[#18181d]
      "
          >
            {/* Icon */}
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-red-500/10">
              <TrashIcon size={20} className="text-red-500" />
            </div>

            {/* Heading */}
            <h2 className="text-lg font-semibold text-[#1a1a1e] dark:text-[#f5f5f7]">
              Delete chat?
            </h2>

            {/* Description */}
            <p className="mt-2 text-sm leading-6 text-[#6b6b73] dark:text-[#8a8a92]">
              Are you sure you want to delete{" "}
              <span className="font-medium text-[#1a1a1e] dark:text-[#f5f5f7]">
                "{deleteChatTitle}"
              </span>
              ?
              <br />
              This action cannot be undone.
            </p>

            {/* Buttons */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={cancelDelete}
                disabled={isDeleting}
                className="
            rounded-lg
            px-4 py-2
            text-sm font-medium
            text-[#6b6b73]
            transition
            hover:bg-[#eaeaec]
            disabled:cursor-not-allowed
            disabled:opacity-50
            dark:text-[#a1a1aa]
            dark:hover:bg-[#26262c]
          "
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="
            flex min-w-[90px]
            items-center justify-center
            rounded-lg
            bg-red-500
            px-4 py-2
            text-sm font-medium
            text-white
            transition
            hover:bg-red-600
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
// import { PlusIcon, HistoryIcon, LogOutIcon, TrashIcon, Edit, Check, X } from "lucide-react";
// import { deleteChatMessages, getChats, renameChat } from "../api/chat";
// import { useAuth } from "../context/AuthContext";

// export default function Sidebar({ isOpen, onToggle, onSelectChat, onNewChat }) {
//   const { logout } = useAuth();
//   const [history, setHistory] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [editingId, setEditingId] = useState(null); // which chat is currently being renamed
//   const [draftTitle, setDraftTitle] = useState("");

//   useEffect(() => {
//     if (!isOpen) return;
//     setLoading(true);
//     getChats()
//       .then(setHistory)
//       .catch(() => setHistory([]))
//       .finally(() => setLoading(false));
//   }, [isOpen]);

//   const handleDelete = async (e, chatId) => {
//     e.stopPropagation();
//     try {
//       await deleteChatMessages(chatId);
//       setHistory((prev) => prev.filter((chat) => chat._id !== chatId));
//     } catch (err) {
//       console.error(err);
//     }
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
//         prev.map((chat) => (chat._id === chatId ? { ...chat, title: updated.title } : chat))
//       );
//     } catch (err) {
//       console.error(err);
//     } finally {
//       cancelEditing();
//     }
//   };

//   const handleTitleKeyDown = (e, chatId) => {
//     if (e.key === "Enter") confirmRename(e, chatId);
//     if (e.key === "Escape") cancelEditing(e);
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
//       <div className="flex flex-col gap-1 p-2">
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

//               return (
//                 <div
//                   key={chat._id}
//                   className="group flex items-center justify-between rounded-lg hover:bg-[#eaeaec] dark:hover:bg-[#22222a]"
//                 >
//                   {isEditing ? (
//                     <input
//                       autoFocus
//                       value={draftTitle}
//                       onChange={(e) => setDraftTitle(e.target.value)}
//                       onKeyDown={(e) => handleTitleKeyDown(e, chat._id)}
//                       onClick={(e) => e.stopPropagation()}
//                       className="
//                         flex-1 rounded-md border border-[#ff7a18] bg-white dark:bg-[#0a0a0c]
//                         px-3 py-1.5 text-sm text-[#1a1a1e] dark:text-[#f5f5f7] outline-none
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
//                         onClick={(e) => handleDelete(e, chat._id)}
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

//       <div className="mt-auto border-t border-[#e5e5e8] p-2 dark:border-[#26262c]">
//         <button
//           onClick={logout}
//           aria-label="Logout"
//           title="Logout"
//           className="flex h-10 w-10 items-center justify-center rounded-lg text-[#6b6b73] dark:text-[#8a8a92] transition hover:bg-[#eaeaec] dark:hover:bg-[#22222a] hover:text-[#1a1a1e] dark:hover:text-[#f5f5f7]"
//         >
//           <LogOutIcon size={18} />
//         </button>
//       </div>
//     </aside>
//   );
// }
