import { useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";

export default function PromptInput({ onRequireLogin, defaultValue = "" }) {
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
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return alert("Voice input not supported in this browser.");

    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }
    const rec = new SR();
    rec.lang = "en-US";
    rec.interimResults = false;
    rec.onresult = (e) => setValue((p) => p + e.results[0][0].transcript);
    rec.onend = () => setListening(false);
    rec.start();
    recognitionRef.current = rec;
    setListening(true);
  };

  return (
    <div className="zc-prompt">
      <textarea
        className="zc-prompt-field"
        placeholder="Deploy an autonomous AI agent to monitor liquidity pools..."
        rows={1}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <div className="zc-prompt-actions">
        <button
          className={`zc-mic ${listening ? "zc-mic-live" : ""}`}
          onClick={toggleVoice}
          title="Voice input"
        >
          🎙️
        </button>
        <button className="zc-send" onClick={submitPrompt} title="Send">
          ➤
        </button>
      </div>
    </div>
  );
}