import { useState } from "react";
import { Square, Send } from "lucide-react";

import TokenSizeSelect from "./TokenSizeSelect";

export default function ChatInput({
  onSend,
  onStop,
  isStreaming,
  tokenSize,
  onTokenSizeChange,
  onProClick,
}) {
  const [value, setValue] = useState("");

  const handleSend = () => {
    const trimmed = value.trim();

    if (!trimmed) {
      return;
    }

    onSend(trimmed, tokenSize);

    setValue("");
  };

  const handleKeyDown = (e) => {
    if (
      e.key === "Enter" &&
      !e.shiftKey
    ) {
      e.preventDefault();

      handleSend();
    }
  };

  return (
    <div
      className="
        flex shrink-0 flex-col gap-2
        border-t border-[#e5e5e8]
        bg-[#f7f7f8]
        p-3
        dark:border-[#26262c]
        dark:bg-[#0a0a0c]
        sm:p-4
      "
    >
      {/* Input row */}

      <div className="flex items-end gap-2">
        <textarea
          value={value}
          onChange={(e) =>
            setValue(e.target.value)
          }
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          rows={1}
          className="
            max-h-40 min-w-0 flex-1
            resize-none
            rounded-xl
            border border-[#e5e5e8]
            bg-white
            px-3 py-2
            text-sm
            text-[#1a1a1e]
            outline-none
            placeholder:text-[#6b6b73]
            focus:border-[#ff7a18]
            focus:ring-2
            focus:ring-[#ff7a18]/20
            dark:border-[#2a2a30]
            dark:bg-[#141418]
            dark:text-[#f5f5f7]
            dark:placeholder:text-[#8a8a92]
            sm:px-4
            sm:text-base
          "
        />

        <button
          type="button"
          onClick={
            isStreaming
              ? onStop
              : handleSend
          }
          disabled={
            !isStreaming &&
            !value.trim()
          }
          aria-label={
            isStreaming
              ? "Stop generation"
              : "Send message"
          }
          title={
            isStreaming
              ? "Stop generation"
              : "Send message"
          }
          className="
            flex h-10 w-10
            shrink-0
            items-center justify-center
            rounded-xl
            bg-gradient-to-br
            from-[#ff7a18]
            to-[#ff4d00]
            text-white
            transition
            hover:-translate-y-px
            hover:shadow-[0_6px_24px_rgba(255,77,0,0.4)]
            disabled:cursor-not-allowed
            disabled:opacity-40
            sm:h-11 sm:w-11
          "
        >
          {isStreaming ? (
            <Square
              size={16}
              fill="currentColor"
            />
          ) : (
            <Send size={17} />
          )}
        </button>
      </div>

      {/* Token size */}

      <div
        className="
          flex items-center gap-2 px-1
        "
      >
        <span
          className="
            text-xs
            text-[#6b6b73]
            dark:text-[#8a8a92]
          "
        >
          Response effort:
        </span>

        <TokenSizeSelect
          value={tokenSize}
          onChange={onTokenSizeChange}
          onProClick={onProClick}
        />
      </div>
    </div>
  );
}
