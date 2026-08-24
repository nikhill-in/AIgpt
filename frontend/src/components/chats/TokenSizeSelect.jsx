import { useEffect, useRef, useState } from "react";
import { Lock } from "lucide-react";
import { AuthProvider } from "../../context/AuthContext";

export default function TokenSizeSelect({ value, onChange, onProClick }) {
  const { tokenOptions: options, isPro, authLoading } = AuthProvider.useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e) => {
      if (!menuRef.current?.contains(e.target)) setOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const selected = options.find(({ label }) => label === value) || options[0];

  if (authLoading || !options.length) {
    return (
      <div className="min-w-[8rem] rounded-lg border border-[#e5e5e8] bg-white px-3 py-2 text-xs text-[#6b6b73] dark:border-[#2a2a30] dark:bg-[#141418] dark:text-[#8a8a92]">
        Loading...
      </div>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="
          flex min-w-[8rem] items-center justify-between gap-2 rounded-lg
          border border-[#e5e5e8] bg-white px-3 py-2 text-sm font-medium
          text-[#1a1a1e] transition hover:border-[#ff7a18]
          dark:border-[#2a2a30] dark:bg-[#141418] dark:text-[#f5f5f7]
        "
      >
        <span>{selected?.label || "Select"}</span>
        <span
          className={`text-xs transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        >
          ▾
        </span>
      </button>

      {open && (
        <div
          className="
            absolute bottom-[calc(100%+8px)] left-0 z-50 w-44 rounded-xl border
            border-[#e5e5e8] bg-white p-1
            shadow-[0_20px_80px_rgba(0,0,0,0.15)]
            dark:border-[#26262c] dark:bg-[#141418]
            dark:shadow-[0_20px_80px_rgba(0,0,0,0.6)]
          "
        >
          {options.map(({ label }) => (
            <button
              key={label}
              type="button"
              onClick={() => {
                onChange(label);
                setOpen(false);
              }}
              className={`
                flex w-full items-center justify-between rounded-lg px-3 py-2
                text-sm transition
                ${
                  value === label
                    ? "bg-[#fff3eb] font-medium text-[#ff7a18] dark:bg-[#ff7a18]/10"
                    : "text-[#1a1a1e] hover:bg-[#eaeaec] dark:text-[#f5f5f7] dark:hover:bg-[#22222a]"
                }
              `}
            >
              {label}
            </button>
          ))}

          {!isPro && (
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                onProClick?.();
              }}
              className="
      flex w-full items-center justify-between
      rounded-lg px-3 py-2
      text-sm font-medium text-orange-500
      transition
      hover:bg-orange-50
      dark:hover:bg-orange-950/30
    "
            >
              Extended
              <Lock size={14} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
