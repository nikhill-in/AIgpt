import { useState } from "react";
import { AuthProvider } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import logoDark from "../assets/logoDark.png";
import logoLight from "../assets/logoLight.png";

export default function LoginModal({ onClose, pendingPrompt, onLoginSuccess }) {
  const { login } = AuthProvider.useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { isDark } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setError("");

    try {
      await login(email, password);
      if (onLoginSuccess) onLoginSuccess();
      else onClose();

      if (pendingPrompt) {
        console.log("Resume prompt after login:", pendingPrompt);
      }
    } catch (err) {
      setError("Incorrect email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={onClose}
      className="
        fixed
        inset-0
        z-[9999]
        flex
        items-center
        justify-center
        bg-black/70
        px-4
        py-6
      "
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="
          relative
          w-full
          max-w-[440px]
          rounded-2xl
          border
          border-[#26262c]
          bg-white dark:bg-[#141418]
          p-7
          shadow-[0_20px_80px_rgba(0,0,0,0.6)]

          max-[480px]:p-5
        "
      >
        <button
          className="
            absolute
            right-4
            top-4
            flex
            h-8
            w-8
            items-center
            justify-center
            rounded-lg
            border
            border-transparent
            bg-transparent
            text-[#8a8a92]
            transition
            duration-200
            hover:border-[#33333a]
            hover:bg-[#22222a]
            hover:text-[#f5f5f7]
          "
          onClick={onClose}
        >
          ✕
        </button>

        <div className="flex items-center justify-center">
          <img
            src={isDark ? logoDark : logoLight}
            alt="ZoomCon"
            className="h-26 w-auto"
          />
        </div>

        <h2 className="text-center text-2xl font-bold text-[#1a1a1e] dark:text-[#f5f5f7]">
          Welcome to ZoomCon
        </h2>

        {pendingPrompt && (
          <p
            className="
              mt-3
              text-center
              text-sm
              leading-6
              text-[#8a8a92]
            "
          >
            Sign in to run: “{pendingPrompt}”
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="
              w-full
              rounded-xl
              border
              border-[#2a2a30]
              bg-[#0a0a0c]
              px-4
              py-3
              text-[#f5f5f7]
              outline-none
              placeholder:text-[#8a8a92]
              transition
              duration-200
              focus:border-[#ff7a18]
              focus:ring-2
              focus:ring-[#ff7a18]/20
            "
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="
              w-full
              rounded-xl
              border
              border-[#2a2a30]
              bg-[#0a0a0c]
              px-4
              py-3
              text-[#f5f5f7]
              outline-none
              placeholder:text-[#8a8a92]
              transition
              duration-200
              focus:border-[#ff7a18]
              focus:ring-2
              focus:ring-[#ff7a18]/20
            "
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="
              mt-2
              w-full
              rounded-[10px]
              bg-gradient-to-br
              from-[#ff7a18]
              to-[#ff4d00]
              px-[22px]
              py-[10px]
              font-semibold
              text-white
              transition
              duration-200
              hover:-translate-y-px
              hover:shadow-[0_6px_24px_rgba(255,77,0,0.4)]
            "
          >
            Sign In
          </button>
        </form>

        <p
          className="
            mt-5
            text-center
            text-sm
            text-[#8a8a92]
          "
        >
          No account?{" "}
          <a
            href="#signup"
            className="
              text-[#ff7a18]
              transition-colors
              duration-200
              hover:text-[#f5f5f7]
            "
          >
            Create one
          </a>
        </p>
      </div>
    </div>
  );
}
