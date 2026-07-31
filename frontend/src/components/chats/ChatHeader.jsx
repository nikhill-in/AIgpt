import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

export default function ChatHeader({ searchQuery, onSearchChange }) {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <div className="flex items-center justify-between gap-4 border-b border-[#26262c] bg-[#0a0a0c] px-6 py-4">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search chats..."
        className="
          w-full max-w-xs rounded-lg border border-[#2a2a30] bg-[#141418]
          px-3 py-2 text-sm text-[#f5f5f7] outline-none
          placeholder:text-[#8a8a92] focus:border-[#ff7a18]
        "
      />

      <div className="flex items-center gap-3">
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-[#8a8a92] transition hover:bg-[#22222a] hover:text-[#f5f5f7]"
        >
          {isDark ? "☀️" : "🌙"}
        </button>

        <div className="relative">
          <button
            onClick={() => setShowProfileMenu((prev) => !prev)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#ff7a18] to-[#ff4d00] font-semibold text-white"
          >
            {user?.email?.[0]?.toUpperCase() || "?"}
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 top-11 w-48 rounded-xl border border-[#26262c] bg-[#141418] p-2 shadow-[0_20px_80px_rgba(0,0,0,0.6)]">
              <p className="truncate px-3 py-2 text-sm text-[#8a8a92]">
                {user?.email}
              </p>
              <button
                onClick={logout}
                className="w-full rounded-lg px-3 py-2 text-left text-sm text-[#f5f5f7] transition hover:bg-[#22222a]"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}