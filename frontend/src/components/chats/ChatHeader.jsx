import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { MoonIcon, SunDimIcon } from "lucide-react";

import { AuthProvider } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

import logoDark from "../../assets/LogoDark.png";
import logoLight from "../../assets/logoLight.png";

export default function ChatHeader({
  onHistoryClick,
  onProClick,
  profileMenuOpen,
  onProfileMenuChange,
}) {
  const { user, isPro, logout } = AuthProvider.useAuth();
  const { isDark, toggleTheme } = useTheme();

  const menuRef = useRef(null);

  useEffect(() => {
    if (!profileMenuOpen) return;

    const handleClickOutside = ({ target }) => {
      if (!menuRef.current?.contains(target)) {
        onProfileMenuChange(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileMenuOpen, onProfileMenuChange]);

  const handleHistory = () => {
    onProfileMenuChange(false);
    onHistoryClick?.();
  };

  const handlePro = () => {
    onProfileMenuChange(false);
    onProClick?.();
  };

  const handleLogout = async () => {
    onProfileMenuChange(false);
    await logout();
  };

  return (
    <header
      className="
        flex h-16 shrink-0 items-center justify-between
        border-b border-[#e5e7eb]
        bg-white px-3 sm:px-4 md:px-6
        dark:border-[#26262c] dark:bg-[#0a0a0c]
      "
    >
      <Link
        to="/"
        className="flex shrink-0 items-center"
        aria-label="Go to home"
      >
        <img
          src={isDark ? logoDark : logoLight}
          alt="ZoomCon"
          className="h-16 w-auto  md:h-18"
        />
      </Link>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Theme Toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="
            flex h-9 w-9 items-center justify-center rounded-lg
            text-[#4b5563] transition
            hover:bg-[#f3f4f6] hover:text-[#111827]
            dark:text-[#9ca3af]
            dark:hover:bg-[#22222a] dark:hover:text-white
          "
        >
          {isDark ? <SunDimIcon size={19} /> : <MoonIcon size={19} />}
        </button>

        {/* Profile */}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => onProfileMenuChange(!profileMenuOpen)}
            aria-label="Open profile menu"
            aria-expanded={profileMenuOpen}
            className="
    relative flex h-9 w-9 items-center justify-center
    rounded-full bg-gradient-to-br from-[#ff7a18] to-[#ff4d00]
    text-sm font-semibold text-white
    shadow-sm transition hover:scale-105
    focus:outline-none focus:ring-2 focus:ring-[#ff7a18]/40
  "
          >
            {user?.email?.charAt(0).toUpperCase() || "?"}

            {isPro && (
              <span
                className="
                  absolute -right-2 -top-2
                  rounded-full px-1.5 py-0.5
                  bg-gradient-to-r from-yellow-400 via-orange-500 to-orange-600
                  text-[8px] font-extrabold tracking-wide text-white
                  shadow-sm ring-2 ring-white
                  dark:ring-[#0a0a0c]
                "
              >
                PRO
              </span>
            )}
          </button>

          {profileMenuOpen && (
            <div
              className="
      absolute right-0 top-[calc(100%+10px)] z-50
      w-52 overflow-hidden rounded-xl
      border border-[#e5e7eb] bg-white p-1.5
      shadow-[0_16px_50px_rgba(0,0,0,0.12)]
      dark:border-[#2a2a30] dark:bg-[#141418]
      dark:shadow-[0_16px_50px_rgba(0,0,0,0.5)]
    "
            >
              {/* User Info */}
              <div
                className="
                  mb-1 rounded-lg px-3 py-2
                  text-sm text-[#6b7280]
                  dark:text-[#9ca3af]
                "
              >
                <p className="truncate">{user?.email}</p>

                {isPro && (
                  <span className="text-xs font-semibold text-orange-500">
                    Pro Member
                  </span>
                )}
              </div>

              <div className="mx-1 border-t border-[#e5e7eb] dark:border-[#2a2a30]" />

              {/* History */}
              <button
                type="button"
                onClick={handleHistory}
                className="
                  mt-1 w-full rounded-lg px-3 py-2 text-left text-sm
                  text-[#374151] transition
                  hover:bg-[#f3f4f6] hover:text-[#111827]
                  dark:text-[#e5e7eb]
                  dark:hover:bg-[#22222a] dark:hover:text-white
                "
              >
                History
              </button>

              {/* Upgrade */}
              {!isPro && (
                <button
                  type="button"
                  onClick={handlePro}
                  className="
                    group w-full rounded-lg px-3 py-2 text-left text-sm
                    text-[#374151] transition
                    hover:bg-orange-50 dark:text-[#e5e7eb]
                    dark:hover:bg-orange-500/10
                  "
                >
                  Get{" "}
                  <span
                    className="
                      font-semibold text-orange-500 transition
                      group-hover:text-orange-600
                    "
                  >
                    Pro
                  </span>
                </button>
              )}

              <div className="mx-1 my-1 border-t border-[#e5e7eb] dark:border-[#2a2a30]" />

              {/* Logout */}
              <button
                type="button"
                onClick={handleLogout}
                className="
                  w-full rounded-lg px-3 py-2 text-left text-sm
                  text-red-600 transition hover:bg-red-50
                  dark:text-red-400 dark:hover:bg-red-500/10
                "
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
