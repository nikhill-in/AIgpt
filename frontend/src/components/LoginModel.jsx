import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function LoginModal({ onClose, pendingPrompt }) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) return;

    // TODO: call your backend auth endpoint
    login(email);
    onClose();

    if (pendingPrompt) {
      console.log("Resume prompt after login:", pendingPrompt);
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
          bg-[#141418]
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

        <div
          className="
            mx-auto
            mb-3
            h-16
            w-16
            rounded-full
            bg-[radial-gradient(circle_at_35%_30%,#ffe0b0,var(--zc-orange)_45%,var(--zc-orange-deep)_100%)]
            shadow-[0_0_40px_rgba(255,122,24,0.6)]
            animate-[zc-pulse_3.5s_ease-in-out_infinite]
          "
        />

        <h2 className="text-center text-2xl font-bold text-[#f5f5f7]">
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

        <form
          onSubmit={handleSubmit}
          className="mt-6 flex flex-col gap-3"
        >
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

          <button
            type="submit"
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