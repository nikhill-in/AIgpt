import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CopyIcon, CheckIcon, PencilIcon, XIcon, CheckCircleIcon } from "lucide-react";

const COLLAPSE_THRESHOLD = 500;

export default function MessageBubble({ role, content, createdAt, onEdit }) {
  const isUser = role === "user";
  const isLong = content.length > COLLAPSE_THRESHOLD;

  const [expanded, setExpanded] = useState(!isLong);
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(content);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleConfirmEdit = () => {
    if (!draft.trim() || draft === content) {
      setIsEditing(false);
      return;
    }
    onEdit(draft.trim());
    setIsEditing(false);
  };

  const formattedTime = createdAt
    ? new Date(createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "";

  if (isEditing) {
    return (
      <div className="flex w-full flex-col items-end">
        <div className="max-w-[75%] w-full rounded-2xl border border-[#ff7a18] bg-white dark:bg-[#141418] p-3">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={3}
            autoFocus
            className="w-full resize-none bg-transparent text-sm text-[#1a1a1e] dark:text-[#f5f5f7] outline-none"
          />
          <div className="mt-2 flex justify-end gap-2">
            <button
              onClick={() => { setDraft(content); setIsEditing(false); }}
              className="flex items-center gap-1 rounded-lg px-3 py-1 text-xs text-[#6b6b73] dark:text-[#8a8a92] hover:bg-[#eaeaec] dark:hover:bg-[#22222a]"
            >
              <XIcon size={13} /> Cancel
            </button>
            <button
              onClick={handleConfirmEdit}
              className="flex items-center gap-1 rounded-lg bg-gradient-to-br from-[#ff7a18] to-[#ff4d00] px-3 py-1 text-xs font-medium text-white"
            >
              <CheckCircleIcon size={13} /> Save & Regenerate
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex w-full flex-col ${isUser ? "items-end" : "items-start"}`}>
      
      <div
        className={`
          max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-6
          ${isUser
            ? "bg-gradient-to-br from-[#183bff] to-[#1e00ff] text-white"
            : "border border-[#e5e5e8] dark:border-[#26262c] bg-white dark:bg-[#141418] text-[#1a1a1e] dark:text-[#f5f5f7]"}
        `}
      >
        <div
          className={`
            prose prose-sm max-w-none
            ${isUser ? "prose-invert" : "dark:prose-invert"}
            ${!expanded ? "line-clamp-[10] overflow-hidden" : ""}
          `}
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </div>

        {isLong && (
          <button
            onClick={() => setExpanded((prev) => !prev)}
            className={`mt-2 text-xs font-medium underline underline-offset-2 ${isUser ? "text-white/80 hover:text-white" : "text-[#ff7a18] hover:text-[#ff4d00]"}`}
          >
            {expanded ? "Show less" : "Show more"}
          </button>
        )}
      </div>

      <div className="mt-1 flex items-center gap-3 px-1 text-xs text-[#6b6b73] dark:text-[#8a8a92]">
        {formattedTime && <span>{formattedTime}</span>}

        <button
          onClick={handleCopy}
          aria-label="Copy message"
          className="flex items-center gap-1 transition hover:text-[#1a1a1e] dark:hover:text-[#f5f5f7]"
        >
          {copied ? <CheckIcon size={13} /> : <CopyIcon size={13} />}
          {copied ? "Copied" : "Copy"}
        </button>

        {isUser && onEdit && (
          <button
            onClick={() => setIsEditing(true)}
            aria-label="Edit message"
            className="flex items-center gap-1 transition hover:text-[#1a1a1e] dark:hover:text-[#f5f5f7]"
          >
            <PencilIcon size={13} />
            Edit
          </button>
        )}
      </div>
    </div>
  );
}
