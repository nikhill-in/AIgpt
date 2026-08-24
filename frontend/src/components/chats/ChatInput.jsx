import { useState } from "react";
import TokenSizeSelect from "./TokenSizeSelect";

export default function ChatInput({ onSend, disabled, onProClick }) {
  const [value, setValue] = useState("");
  const [maxTokens, setMaxTokens] = useState("Short");

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed, maxTokens);
    setValue("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col gap-2 border-t border-[#e5e5e8] dark:border-[#26262c] bg-[#f7f7f8] dark:bg-[#0a0a0c] p-3 sm:p-4">
      {/* Textarea + Send button row */}
      <div className="flex items-end gap-2">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          rows={1}
          className="
            max-h-40 flex-1 resize-none rounded-xl
            border border-[#e5e5e8] dark:border-[#2a2a30]
            bg-white dark:bg-[#141418]
            px-3 py-2 sm:px-4
            text-sm sm:text-base
            text-[#1a1a1e] dark:text-[#f5f5f7] outline-none
            placeholder:text-[#6b6b73] dark:placeholder:text-[#8a8a92]
            focus:border-[#ff7a18]
            focus:ring-2 focus:ring-[#ff7a18]/20
          "
        />
        <button
          onClick={handleSend}
          disabled={disabled || !value.trim()}
          className="
            shrink-0 rounded-xl bg-gradient-to-br from-[#ff7a18] to-[#ff4d00]
            px-4 py-2 sm:px-5
            text-sm sm:text-base font-semibold text-white transition
            hover:-translate-y-px hover:shadow-[0_6px_24px_rgba(255,77,0,0.4)]
            disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0
          "
        >
          Send
        </button>
      </div>

      {/* Token size row — separate row below for clean responsive layout */}
      <div className="flex items-center gap-2 px-1">
        <span className="text-xs text-[#6b6b73] dark:text-[#8a8a92]">
          Response effort:
        </span>
        <TokenSizeSelect
          value={maxTokens}
          onChange={setMaxTokens}
          onProClick={onProClick}
        />
      </div>
    </div>
  );
}
