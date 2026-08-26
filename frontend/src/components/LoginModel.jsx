import { useState } from "react";
import { useForm } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import {
  Eye,
  EyeOff,
  LogIn,
  UserPlus,
  X,
} from "lucide-react";

import { AuthProvider } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { registerUser } from "../api/auth";

import logoDark from "../assets/LogoDark.png";
import logoLight from "../assets/logoLight.png";

export default function LoginModal({
  onClose,
  pendingPrompt,
  onLoginSuccess,
}) {
  const { login } = AuthProvider.useAuth();
  const { isDark } = useTheme();

  const [mode, setMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const isLogin = mode === "login";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    mode: "onTouched",
  });

  const switchMode = (nextMode) => {
    if (loading || mode === nextMode) return;

    setServerError("");
    setShowPassword(false);
    reset();

    setMode(nextMode);
  };

  const handleFormSubmit = async (data) => {
    setLoading(true);
    setServerError("");

    try {
      if (isLogin) {
        await login(data.email.trim(), data.password);
      } else {
        await registerUser(
          data.name.trim(),
          data.email.trim(),
          data.password,
        );
      }

      onLoginSuccess?.();
      onClose?.();

      if (pendingPrompt) {
        console.log("Resume prompt after auth:", pendingPrompt);
      }
    } catch (err) {
      setServerError(
        err.response?.data?.message ||
          (isLogin
            ? "Incorrect email or password."
            : "Unable to create your account."),
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (hasError = false) => `
    w-full rounded-xl border bg-white px-4 py-3
    text-sm text-[#111827] outline-none
    placeholder:text-[#9ca3af]
    transition-all duration-200
    dark:bg-[#0f0f12] dark:text-[#f5f5f7]
    dark:placeholder:text-[#71717a]
    ${
      hasError
        ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/10"
        : "border-[#e5e7eb] focus:border-[#ff7a18] focus:ring-2 focus:ring-[#ff7a18]/15 dark:border-[#2a2a30]"
    }
  `;

  return (
    <div
      className="
        fixed inset-0 z-[9999]
        flex items-center justify-center
        overflow-y-auto
        bg-black/50 px-4 py-6
        backdrop-blur-md
        sm:px-6
      "
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !loading) {
          onClose?.();
        }
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 18 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 18 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        className="
          relative flex w-full max-w-4xl
          overflow-hidden rounded-3xl
          border border-[#e5e7eb]
          bg-white
          shadow-[0_30px_100px_rgba(0,0,0,0.22)]
          dark:border-[#29292f]
          dark:bg-[#141418]
          dark:shadow-[0_30px_100px_rgba(0,0,0,0.65)]
        "
      >
        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          aria-label="Close"
          className="
            absolute right-4 top-4 z-20
            flex h-9 w-9 items-center justify-center
            rounded-full
            border border-transparent
            text-[#6b7280]
            transition
            hover:bg-[#f3f4f6]
            hover:text-[#111827]
            disabled:cursor-not-allowed
            disabled:opacity-40
            dark:text-[#9ca3af]
            dark:hover:bg-[#22222a]
            dark:hover:text-white
          "
        >
          <X size={18} />
        </button>

        {/* Left visual panel */}
        <div
          className="
            hidden w-[42%] shrink-0
            flex-col justify-between
            bg-gradient-to-br
            from-[#ff7a18] via-[#ff6410] to-[#ff4d00]
            p-8 text-white
            lg:flex
          "
        >
          <div>
            <img
              src={isDark ? logoDark : logoLight}
              alt="AIgpt"
              className="
                h-12 w-auto
                brightness-0 invert
              "
            />

            <div className="mt-16 max-w-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/70">
                AIgpt
              </p>

              <h2 className="mt-4 text-4xl font-bold leading-tight">
                {isLogin
                  ? "Ask better. Get answers faster."
                  : "Your AI workspace starts here."}
              </h2>

              <p className="mt-5 text-sm leading-6 text-white/80">
                {isLogin
                  ? "Sign in and continue your conversations, history, and personalized AI experience."
                  : "Create your account and start chatting with an AI assistant built for focused answers."}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
            <p className="text-sm text-white/90">
              {isLogin
                ? "Welcome back."
                : "Create your account in a few seconds."}
            </p>
          </div>
        </div>

        {/* Right form panel */}
        <div className="min-w-0 flex-1 p-5 sm:p-7 md:p-8 lg:p-10">
          {/* Mobile logo */}
          <div className="mb-5 flex justify-center lg:hidden">
            <img
              src={isDark ? logoDark : logoLight}
              alt="ZoomCon"
              className="h-12 w-auto"
            />
          </div>

          {/* Heading */}
          <div className="text-center sm:text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#ff7a18]">
              {isLogin ? "Welcome back" : "Get started"}
            </p>

            <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#111827] sm:text-3xl dark:text-[#f5f5f7]">
              {isLogin ? "Sign in to ZoomCon" : "Create your account"}
            </h2>

            <p className="mt-2 text-sm text-[#6b7280] dark:text-[#9ca3af]">
              {isLogin
                ? "Continue where you left off."
                : "Join ZoomCon and start asking questions."}
            </p>
          </div>

          {/* Pending prompt */}
          {isLogin && pendingPrompt && (
            <div
              className="
                mt-5 rounded-xl
                border border-orange-200
                bg-orange-50 px-4 py-3
                text-sm text-orange-700
                dark:border-orange-500/20
                dark:bg-orange-500/10
                dark:text-orange-300
              "
            >
              Sign in to run:
              <span className="mt-1 block truncate font-medium">
                “{pendingPrompt}”
              </span>
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={handleSubmit(handleFormSubmit)}
            className="mt-6"
            noValidate
          >
            <AnimatePresence mode="wait" initial={false}>
              {isLogin ? (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  {/* Email */}
                  <div>
                    <label
                      htmlFor="login-email"
                      className="mb-1.5 block text-sm font-medium text-[#374151] dark:text-[#d4d4d8]"
                    >
                      Email
                    </label>

                    <input
                      id="login-email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Enter a valid email",
                        },
                      })}
                      className={inputClass(!!errors.email)}
                    />

                    {errors.email && (
                      <p className="mt-1.5 text-xs text-red-500">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Password */}
                  <div>
                    <label
                      htmlFor="login-password"
                      className="mb-1.5 block text-sm font-medium text-[#374151] dark:text-[#d4d4d8]"
                    >
                      Password
                    </label>

                    <div className="relative">
                      <input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        placeholder="Enter your password"
                        {...register("password", {
                          required: "Password is required",
                        })}
                        className={`${inputClass(
                          !!errors.password,
                        )} pr-12`}
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword((prev) => !prev)
                        }
                        aria-label={
                          showPassword
                            ? "Hide password"
                            : "Show password"
                        }
                        className="
                          absolute right-2 top-1/2
                          flex h-8 w-8 -translate-y-1/2
                          items-center justify-center
                          rounded-lg text-[#9ca3af]
                          hover:bg-[#f3f4f6]
                          hover:text-[#374151]
                          dark:hover:bg-[#22222a]
                          dark:hover:text-white
                        "
                      >
                        {showPassword ? (
                          <EyeOff size={17} />
                        ) : (
                          <Eye size={17} />
                        )}
                      </button>
                    </div>

                    {errors.password && (
                      <p className="mt-1.5 text-xs text-red-500">
                        {errors.password.message}
                      </p>
                    )}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="register"
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 24 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  {/* Name */}
                  <div>
                    <label
                      htmlFor="register-name"
                      className="mb-1.5 block text-sm font-medium text-[#374151] dark:text-[#d4d4d8]"
                    >
                      Full name
                    </label>

                    <input
                      id="register-name"
                      type="text"
                      autoComplete="name"
                      placeholder="Nikhil Singh"
                      {...register("name", {
                        required: "Name is required",
                        minLength: {
                          value: 2,
                          message: "Name must be at least 2 characters",
                        },
                      })}
                      className={inputClass(!!errors.name)}
                    />

                    {errors.name && (
                      <p className="mt-1.5 text-xs text-red-500">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="register-email"
                      className="mb-1.5 block text-sm font-medium text-[#374151] dark:text-[#d4d4d8]"
                    >
                      Email
                    </label>

                    <input
                      id="register-email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Enter a valid email",
                        },
                      })}
                      className={inputClass(!!errors.email)}
                    />

                    {errors.email && (
                      <p className="mt-1.5 text-xs text-red-500">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Password */}
                  <div>
                    <label
                      htmlFor="register-password"
                      className="mb-1.5 block text-sm font-medium text-[#374151] dark:text-[#d4d4d8]"
                    >
                      Password
                    </label>

                    <div className="relative">
                      <input
                        id="register-password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        placeholder="At least 6 characters"
                        {...register("password", {
                          required: "Password is required",
                          minLength: {
                            value: 6,
                            message:
                              "Password must be at least 6 characters",
                          },
                        })}
                        className={`${inputClass(
                          !!errors.password,
                        )} pr-12`}
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword((prev) => !prev)
                        }
                        aria-label={
                          showPassword
                            ? "Hide password"
                            : "Show password"
                        }
                        className="
                          absolute right-2 top-1/2
                          flex h-8 w-8 -translate-y-1/2
                          items-center justify-center
                          rounded-lg text-[#9ca3af]
                          hover:bg-[#f3f4f6]
                          hover:text-[#374151]
                          dark:hover:bg-[#22222a]
                          dark:hover:text-white
                        "
                      >
                        {showPassword ? (
                          <EyeOff size={17} />
                        ) : (
                          <Eye size={17} />
                        )}
                      </button>
                    </div>

                    {errors.password && (
                      <p className="mt-1.5 text-xs text-red-500">
                        {errors.password.message}
                      </p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Server error */}
            {serverError && (
              <div
                className="
                  mt-4 rounded-xl
                  border border-red-200
                  bg-red-50 px-4 py-3
                  text-sm text-red-600
                  dark:border-red-500/20
                  dark:bg-red-500/10
                  dark:text-red-400
                "
              >
                {serverError}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="
                mt-5 flex w-full items-center justify-center gap-2
                rounded-xl
                bg-gradient-to-br from-[#ff7a18] to-[#ff4d00]
                px-5 py-3
                text-sm font-semibold text-white
                shadow-sm
                transition-all duration-200
                hover:-translate-y-0.5
                hover:shadow-[0_8px_26px_rgba(255,77,0,0.28)]
                focus:outline-none
                focus:ring-2 focus:ring-[#ff7a18]/30
                disabled:cursor-not-allowed
                disabled:opacity-50
                disabled:hover:translate-y-0
              "
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span
                    className="
                      h-4 w-4 animate-spin rounded-full
                      border-2 border-white/30
                      border-t-white
                    "
                  />
                  {isLogin ? "Signing in..." : "Creating account..."}
                </span>
              ) : (
                <>
                  {isLogin ? (
                    <LogIn size={17} />
                  ) : (
                    <UserPlus size={17} />
                  )}

                  {isLogin ? "Sign In" : "Create Account"}
                </>
              )}
            </button>
          </form>

          {/* Switch mode */}
          <div className="mt-6 text-center text-sm text-[#6b7280] dark:text-[#9ca3af]">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() =>
                switchMode(isLogin ? "register" : "login")
              }
              disabled={loading}
              className="
                font-semibold text-[#ff7a18]
                transition-colors
                hover:text-[#e85f00]
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              {isLogin ? "Create one" : "Sign in"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}