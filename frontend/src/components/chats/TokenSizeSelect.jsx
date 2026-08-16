import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Lock } from "lucide-react";

const OPTIONS = [
  { value: 700, label: "700 · Short", restricted: false },
  { value: 2200, label: "2200 · Standard", restricted: false },
  // { value: 2000, label: "2000 · Extended", restricted: true },
];

const ALLOWED_ROLES = ["admin", "pro"];

export default function TokenSizeSelect({ value, onChange }) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  const hasAccess = ALLOWED_ROLES.includes(user?.role);

  const handleSelect = (option) => {
    if (option.restricted && !hasAccess) return; // guard against selecting a locked option
    onChange(option.value);
    setOpen(false);
  };

  const selected = OPTIONS.find((o) => o.value === value) || OPTIONS[0];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="
          flex items-center w-39  gap-2 rounded-lg border border-[#e5e5e8] dark:border-[#2a2a30]
          bg-white dark:bg-[#141418] px-3 py-2 text-sm font-bold
          text-[#1a1a1e] dark:text-[#f5f5f7] 
          hover:border-[#ff7a18] transition
        "
      >
        {selected.label}
        <span className="text-xl absolute rotate-180 transition-all right-4">▾</span>
      </button>

      {open && (
        <div
          className="
            absolute bottom-11 left-0 w-44 rounded-xl border
            border-[#e5e5e8] dark:border-[#26262c]
            bg-white dark:bg-[#141418] p-1
            shadow-[0_20px_80px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_80px_rgba(0,0,0,0.6)]
          "
        >
          {OPTIONS.map((option) => {
            const locked = option.restricted && !hasAccess;
            return (
              <button
                key={option.value}
                type="button"
                disabled={locked}
                onClick={() => handleSelect(option)}
                className={`
                  flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm
                  transition
                  ${locked
                    ? "cursor-not-allowed text-[#a0a0a6] dark:text-[#5a5a60]"
                    : "text-[#1a1a1e] dark:text-[#f5f5f7] hover:bg-[#eaeaec] dark:hover:bg-[#22222a]"}
                `}
              >
                {option.label}
                {locked && <span className="text-xs"><Lock/></span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}