import PromptInput from "./PromptInput";
import SuggestionChips from "./SuggestionChips";

export default function Hero({ onRequireLogin }) {
  return (
    <header
      className="
        relative z-[2]
        mx-auto
        max-w-[820px]
        px-[6vw]
        pb-[90px]
        pt-[60px]
        text-center
      "
    >
      <div className="mb-[34px] flex justify-center">
        <div
          className="
            h-[130px]
            w-[130px]
            rounded-full
            bg-[radial-gradient(circle_at_35%_30%,#ffe0b0,var(--zc-orange)_45%,var(--zc-orange-deep)_100%)]
            shadow-[0_0_60px_rgba(255,122,24,0.6),inset_0_0_30px_rgba(255,255,255,0.25)]
            animate-[zc-pulse_3.5s_ease-in-out_infinite]

            max-[480px]:h-[100px]
            max-[480px]:w-[100px]
          "
        />
      </div>

      <h1
        className="
          text-[clamp(2rem,5vw,3.4rem)]
          font-extrabold
          tracking-[-1px]
        "
      >
        What is in your mind today?
      </h1>

      <p
        className="
          my-4
          mb-9
          text-[1.05rem]
          text-[#8a8a92]
        "
      >
        Ask any thing here..
      </p>

      <PromptInput onRequireLogin={onRequireLogin} />

      <SuggestionChips onRequireLogin={onRequireLogin} />
    </header>
  );
}