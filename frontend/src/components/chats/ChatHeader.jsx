import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { MoonIcon, SunDimIcon } from "lucide-react";
import logoDark from "../../assets/LogoDark.png";
import logoLight from "../../assets/logoLight.png";

export default function ChatHeader({ onHistoryClick }) {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!showProfileMenu) return;

    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showProfileMenu]);

  return (
    <div className="flex items-center justify-between border-b border-[#e5e5e8] dark:border-[#26262c] bg-[#9c9c9c] dark:bg-[#0a0a0c] px-6">
      

        <img
          src={isDark ? logoDark : logoLight}
          alt="ZoomCon"
          className="h-20 w-auto"
        />
      

      <div className="flex items-center gap-3">
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="
            flex h-9 w-9 items-center justify-center rounded-lg
            text-black dark:text-[#8a8a92] transition
            hover:bg-[#eaeaec] dark:hover:bg-[#22222a]
            hover:text-[#1a1a1e] dark:hover:text-[#f5f5f7]
          "
        >
          {isDark ? <SunDimIcon /> : <MoonIcon />}
        </button>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowProfileMenu((prev) => !prev)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#ff7a18] to-[#ff4d00] font-semibold text-white"
          >
            {user?.email?.[0]?.toUpperCase() || "?"}
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 top-11 w-48 rounded-xl border border-[#e5e5e8] dark:border-[#26262c] bg-white dark:bg-[#141418] p-2 shadow-[0_20px_80px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_80px_rgba(0,0,0,0.6)]">
              <p className="truncate px-3 py-2 text-sm text-black dark:text-[#8a8a92af]">
                {user?.email}
              </p>
              <button
                onClick={onHistoryClick}
                className="
                  w-full rounded-lg px-3 py-2 text-left hover:font-bold
                  transition-all duration-200 text-sm
                  text-[#1a1a1e] dark:text-[#f5f5f77e]
                  hover:bg-[#eaeaec] dark:hover:bg-[#22222a]
                "
              >
                History
              </button>
              <button
                onClick={logout}
                className="
                  w-full rounded-lg px-3 py-2 text-left text-sm
                  text-[#1a1a1e] dark:text-[#f5f5f7] transition
                  hover:bg-[#eaeaec] dark:hover:bg-[#22222a]
                "
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

