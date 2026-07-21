import { useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";

export default function PromptInput({
  onRequireLogin,
  defaultValue = "",
}) {
  const { isLoggedIn } = useAuth();

  const [value, setValue] = useState(defaultValue);
  const [listening, setListening] = useState(false);

  const recognitionRef = useRef(null);

  const submitPrompt = () => {
    const prompt = value.trim();

    if (!prompt) return;

    if (!isLoggedIn) {
      onRequireLogin(prompt);
      return;
    }

    // Authenticated → hand off to your backend / chat route
    console.log("Dispatching prompt to backend:", prompt);

    // e.g. navigate(`/chat?q=${encodeURIComponent(prompt)}`)
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submitPrompt();
    }
  };

  // 🎙️ Voice input (Web Speech API)
  const toggleVoice = () => {
    const SR =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SR) {
      return alert(
        "Voice input not supported in this browser."
      );
    }

    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }

    const rec = new SR();

    rec.lang = "en-US";
    rec.interimResults = false;

    rec.onresult = (e) =>
      setValue(
        (p) =>
          p + e.results[0][0].transcript
      );

    rec.onend = () => setListening(false);

    rec.start();

    recognitionRef.current = rec;
    setListening(true);
  };

  return (
    <div
      className="
        mx-auto
        flex
        w-full
        max-w-[640px]
        items-end
        gap-[10px]
        rounded-2xl
        border
        border-[#26262c]
        bg-[#141418]
        p-3
        shadow-[0_0_40px_rgba(255,122,24,0.08)]

        max-[480px]:gap-2
        max-[480px]:p-2
      "
    >
      <textarea
        className="
          min-h-[42px]
          max-h-[160px]
          flex-1
          resize-none
          overflow-y-auto
          bg-transparent
          px-1
          py-2
          text-base
          leading-[1.5]
          text-[#f5f5f7]
          outline-none

          placeholder:text-[#8a8a92]
        "
        placeholder="Deploy an autonomous AI agent to monitor liquidity pools..."
        rows={1}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />

      <div className="flex shrink-0 gap-2">
        <button
          className={`
            grid
            h-[42px]
            w-[42px]
            place-items-center
            rounded-xl
            border-none
            text-[1.05rem]
            transition-all
            duration-200
            ${
              listening
                ? "animate-[zc-pulse_1.2s_infinite] bg-[#ff7a18] text-white"
                : "bg-[#22222a] text-[#f5f5f7]"
            }

            max-[480px]:h-10
            max-[480px]:w-10
          `}
          onClick={toggleVoice}
          title="Voice input"
          type="button"
        >
          🎙️
        </button>

        <button
          className="
            grid
            h-[42px]
            w-[42px]
            place-items-center
            rounded-xl
            border-none
            bg-gradient-to-br
            from-[#ff7a18]
            to-[#ff4d00]
            text-[1.05rem]
            text-white
            transition
            duration-200
            hover:-translate-y-px

            max-[480px]:h-10
            max-[480px]:w-10
          "
          onClick={submitPrompt}
          title="Send prompt"
          type="button"
        >
          ➤
        </button>
      </div>
    </div>
  );
}