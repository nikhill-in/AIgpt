import { useEffect, useState } from "react";
import { Lock } from "lucide-react";
import { getTokenOptions } from "../../api/chat";

export default function TokenSizeSelect({ value, onChange, onProClick }) {
  const [options, setOptions] = useState([]);
  const [isPro, setIsPro] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await getTokenOptions();

        setOptions(response.data.options);
        setIsPro(response.data.isPro);
      } catch (error) {
        console.error("Failed to load token options", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, []);

  const selected =
    options.find((option) => option.label === value) || options[0];

  if (loading) {
    return (
      <div className="w-39 rounded-lg border border-[#e5e5e8] px-3 py-2 text-sm">
        Loading...
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="
          flex w-39 items-center justify-center gap-2 rounded-lg
          border border-[#e5e5e8] dark:border-[#2a2a30]
          bg-white dark:bg-[#141418]
          px-3 py-2 text-sm font-bold
          text-[#1a1a1e] dark:text-[#f5f5f7]
          hover:border-[#ff7a18] transition
        "
      >
        {selected?.label || "Select"}
        <span className="absolute right-4 rotate-180 text-xl">
          ▾
        </span>
      </button>

      {open && (
        <div
          className="
            absolute bottom-11 left-0 w-44 rounded-xl border
            border-[#e5e5e8] dark:border-[#26262c]
            bg-white dark:bg-[#141418] p-1
            shadow-[0_20px_80px_rgba(0,0,0,0.15)]
            dark:shadow-[0_20px_80px_rgba(0,0,0,0.6)]
          "
        >
          {options.map((option) => (
            <button
              key={option.label}
              type="button"
              onClick={() => {
                onChange(option.label);
                setOpen(false);
              }}
              className="
                flex w-full items-center justify-between
                rounded-lg px-3 py-2 text-sm
                text-[#1a1a1e] dark:text-[#f5f5f7]
                hover:bg-[#eaeaec] dark:hover:bg-[#22222a]
                transition
              "
            >
              {option.label}
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
                rounded-lg px-3 py-2 text-sm
                font-semibold text-orange-600
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