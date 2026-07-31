import { useState } from "react";

export default function ChatInput({ onSend, disabled }) {
  const [value, setValue] = useState("");

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-end gap-2 border-t border-[#26262c] bg-[#0a0a0c] p-4">
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        rows={1}
        className="
          max-h-40 flex-1 resize-none rounded-xl border border-[#2a2a30]
          bg-[#141418] px-4 py-3 text-[#f5f5f7] outline-none
          placeholder:text-[#8a8a92] focus:border-[#ff7a18]
          focus:ring-2 focus:ring-[#ff7a18]/20
        "
      />
      <button
        onClick={handleSend}
        disabled={disabled || !value.trim()}
        className="
          rounded-xl bg-gradient-to-br from-[#ff7a18] to-[#ff4d00]
          px-5 py-3 font-semibold text-white transition
          hover:-translate-y-px hover:shadow-[0_6px_24px_rgba(255,77,0,0.4)]
          disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0
        "
      >
        Send
      </button>
    </div>
  );
}