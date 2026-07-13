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
    <div className="zc-chips">
      {SUGGESTIONS.map((s) => (
        <button key={s} className="zc-chip" onClick={() => handleClick(s)}>
          {s}
        </button>
      ))}
    </div>
  );
}