import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import LoginModal from "../components/LoginModel.jsx";

export default function LandingPage() {
  const [showLogin, setShowLogin] = useState(false);
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const handleStart = () => {
    if (isLoggedIn) {
      navigate("/app");
    } else {
      setShowLogin(true);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#0a0a0c] text-[#f5f5f7]">
      {/* Top bar */}
      <header className="flex items-center justify-between px-[6vw] py-6">
        <div className="flex items-center gap-[10px] text-[1.3rem] font-bold">
          Zoom<span className="text-[#ff7a18]">Con</span>
          <span
            className="
              h-[16px] w-[16px] rounded-full
              bg-[radial-gradient(circle_at_30%_30%,#ffd9a0,#ff4d00)]
              shadow-[0_0_14px_#ff7a18]
            "
          />
        </div>

        <button
          onClick={() => setShowLogin(true)}
          className="
            rounded-[10px] border border-[#33333a] bg-transparent
            px-5 py-2 text-sm font-medium text-[#f5f5f7]
            transition duration-200
            hover:border-[#ff7a18] hover:text-[#ff7a18]
          "
        >
          Log in
        </button>
      </header>

      {/* Hero */}
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-[#8a8a92]">
          ask → answer
        </p>

        <h1 className="max-w-2xl text-4xl font-bold leading-tight sm:text-5xl">
          A chatbot that just answers.
        </h1>

        <p className="mt-5 max-w-md text-base leading-7 text-[#8a8a92]">
          Type a question. Get a generated answer. Nothing else in the way.
        </p>

        {/* Signature element: live example exchange, not decoration */}
        <div className="mt-12 w-full max-w-md rounded-2xl border border-[#26262c] bg-[#141418] p-5 text-left shadow-[0_20px_80px_rgba(0,0,0,0.5)]">
          <div className="flex justify-end">
            <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-gradient-to-br from-[#ff7a18] to-[#ff4d00] px-4 py-2 text-sm text-white">
              What's the capital of Japan?
            </div>
          </div>

          <div className="mt-3 flex justify-start">
            <div className="max-w-[80%] rounded-2xl rounded-tl-sm border border-[#26262c] bg-[#0a0a0c] px-4 py-2 text-sm text-[#f5f5f7]">
              Tokyo.
            </div>
          </div>
        </div>

        <button
          onClick={handleStart}
          className="
            mt-10 rounded-[10px] bg-gradient-to-br from-[#ff7a18] to-[#ff4d00]
            px-8 py-3 text-base font-semibold text-white
            transition duration-200
            hover:-translate-y-px hover:shadow-[0_6px_24px_rgba(255,77,0,0.4)]
          "
        >
          Start asking
        </button>
      </main>

      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onLoginSuccess={() => {
            setShowLogin(false);
            navigate("/app");
          }}
        />
      )}
    </div>
  );
}