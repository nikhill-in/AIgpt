import PromptInput from "./PromptInput";
import SuggestionChips from "./SuggestionChips";

export default function Hero({ onRequireLogin }) {
  return (
    <header className="zc-hero">
      <div className="zc-orb-wrap">
        <div className="zc-orb" />
      </div>

      <h1 className="zc-hero-title">What is in your mind today?</h1>
      <p className="zc-hero-sub">
Ask any thing here..       </p>

      <PromptInput onRequireLogin={onRequireLogin} />
      <SuggestionChips onRequireLogin={onRequireLogin} />
    </header>
  );
}