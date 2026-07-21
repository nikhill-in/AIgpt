import { useAuth } from "../context/AuthContext";

const SUGGESTIONS = [
  "Build a tactical trading robot",
  "Monitor liquidity pools 24/7",
  "Summarize on-chain activity",
  "Alert me on price anomalies",
];

export default function SuggestionChips({ onRequireLogin }) {
  const { isLoggedIn } = useAuth();

  const handleClick = (text) => {
    if (!isLoggedIn) return onRequireLogin(text);

    console.log("Prefill + dispatch:", text);
  };

  return (
    <div
      className="
        mt-[22px]
        flex
        flex-wrap
        justify-center
        gap-[10px]
        px-2

        max-[480px]:gap-2
      "
    >
      {SUGGESTIONS.map((s) => (
        <button
          key={s}
          className="
            cursor-pointer
            rounded-full
            border
            border-[#2a2a30]
            bg-white/[0.04]
            px-4
            py-2
            text-[0.85rem]
            text-[#8a8a92]
            transition-all
            duration-200
            hover:border-[#ff7a18]
            hover:text-[#f5f5f7]

            max-[480px]:px-3
            max-[480px]:py-[7px]
            max-[480px]:text-xs
          "
          onClick={() => handleClick(s)}
          type="button"
        >
          {s}
        </button>
      ))}
    </div>
  );
}