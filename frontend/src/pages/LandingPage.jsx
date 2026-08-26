import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  LogInIcon,
  MoonIcon,
  SunDimIcon,
} from "lucide-react";

import { AuthProvider } from "../context/AuthContext.jsx";
import LoginModal from "../components/LoginModel.jsx";
import { useTheme } from "../context/ThemeContext.jsx";

import logoDark from "../assets/LogoDark.png";
import logoLight from "../assets/logoLight.png";

export default function LandingPage() {
  const [showLogin, setShowLogin] = useState(false);

  const {
    authLoading,
    checkAuth,
  } = AuthProvider.useAuth();

  const { isDark, toggleTheme } = useTheme();

  const navigate = useNavigate();

  // --------------------------------------------------
  // Start / Login button
  // --------------------------------------------------

  const handleOpenApp = async () => {
    if (authLoading) return;

    const currentAuth = await checkAuth();

    if (currentAuth?.user) {
      navigate("/app");
      return;
    }

    setShowLogin(true);
  };

  return (
    <div
      className="
        fixed inset-0
        flex flex-col
        overflow-hidden
        bg-[#f8f9fb] text-[#111827]
        dark:bg-[#0a0a0c] dark:text-[#f5f5f7]
      "
    >
      {/* ------------------------------------------------
          Header
      ------------------------------------------------- */}

      <header
        className="
          flex h-16 shrink-0 w-full
          items-center justify-between
          border-b border-[#e5e7eb]/80
          bg-[#f8f9fb]/90
          px-4
          backdrop-blur-md
          sm:px-6
          lg:px-10
          dark:border-[#26262c]
          dark:bg-[#0a0a0c]/90
        "
      >
        {/* Logo */}

        <button
          type="button"
          onClick={() => navigate("/")}
          aria-label="Go to homepage"
          className="shrink-0"
        >
          <img
            src={isDark ? logoDark : logoLight}
            alt="AIgpt"
            className="
              h-16
              w-auto
              object-contain
              md:h-18
            "
          />
        </button>

        {/* Header actions */}

        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Theme */}

          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title="Toggle theme"
            className="
              flex h-9 w-9
              items-center justify-center
              rounded-lg
              text-[#4b5563]
              transition-all duration-200
              hover:bg-[#eef0f3]
              hover:text-[#111827]
              dark:text-[#9ca3af]
              dark:hover:bg-[#202026]
              dark:hover:text-[#f5f5f7]
            "
          >
            {isDark ? (
              <SunDimIcon size={19} />
            ) : (
              <MoonIcon size={19} />
            )}
          </button>

          {/* Login / Open App */}

          <button
            type="button"
            onClick={handleOpenApp}
            disabled={authLoading}
            aria-label="Login"
            title="Login"
            className="
              flex h-9 w-9
              items-center justify-center
              rounded-lg
              text-[#6b7280]
              transition-all duration-200
              hover:bg-[#eef0f3]
              hover:text-[#111827]
              disabled:cursor-wait
              disabled:opacity-50
              dark:text-[#9ca3af]
              dark:hover:bg-[#202026]
              dark:hover:text-[#f5f5f7]
            "
          >
            {authLoading ? (
              <span
                className="
                  h-4 w-4 animate-spin rounded-full
                  border-2 border-[#ff7a18]/30
                  border-t-[#ff7a18]
                "
              />
            ) : (
              <LogInIcon size={18} />
            )}
          </button>
        </div>
      </header>

      {/* ------------------------------------------------
          Main content
      ------------------------------------------------- */}

      <main
        className="
          flex min-h-0 flex-1
          items-center justify-center
          overflow-y-auto
          overscroll-contain
          px-4 py-10
          sm:px-6 sm:py-14
          lg:px-8
        "
      >
        <div
          className="
            flex w-full
            max-w-3xl
            flex-col
            items-center
            text-center
          "
        >
          {/* Eyebrow */}

          <p
            className="
              mb-4
              font-mono
              text-[11px]
              font-medium
              uppercase
              tracking-[0.28em]
              text-[#6b7280]
              dark:text-[#8a8a92]
            "
          >
            ask → answer
          </p>

          {/* Heading */}

          <h1
            className="
              max-w-3xl
              text-4xl
              font-bold
              leading-[1.08]
              tracking-tight
              text-[#111827]
              sm:text-5xl
              lg:text-6xl
              dark:text-[#f5f5f7]
            "
          >
            A chatbot that just answers.
          </h1>

          {/* Description */}

          <p
            className="
              mt-5
              max-w-xl
              text-sm
              leading-6
              text-[#6b7280]
              sm:text-base
              sm:leading-7
              dark:text-[#9ca3af]
            "
          >
            Type a question. Get a generated answer. Nothing else in the way.
          </p>

          {/* Example chat */}

          <div
            className="
              mt-10
              w-full
              max-w-lg
              rounded-2xl
              border
              border-[#e5e7eb]
              bg-white
              p-4
              text-left
              shadow-[0_20px_60px_rgba(15,23,42,0.08)]
              sm:mt-12
              sm:p-5
              dark:border-[#26262c]
              dark:bg-[#141418]
              dark:shadow-[0_20px_60px_rgba(0,0,0,0.35)]
            "
          >
            {/* User message */}

            <div className="flex justify-end">
              <div
                className="
                  max-w-[88%]
                  rounded-2xl
                  rounded-tr-sm
                  bg-gradient-to-br
                  from-[#ff7a18]
                  to-[#ff4d00]
                  px-4
                  py-2.5
                  text-sm
                  leading-5
                  text-white
                  shadow-sm
                  sm:max-w-[80%]
                "
              >
                What&apos;s the capital of Japan?
              </div>
            </div>

            {/* Assistant message */}

            <div className="mt-3 flex justify-start">
              <div
                className="
                  max-w-[88%]
                  rounded-2xl
                  rounded-tl-sm
                  border
                  border-[#e5e7eb]
                  bg-[#f3f4f6]
                  px-4
                  py-2.5
                  text-sm
                  leading-5
                  text-[#374151]
                  sm:max-w-[80%]
                  dark:border-[#2a2a30]
                  dark:bg-[#0f0f12]
                  dark:text-[#e5e7eb]
                "
              >
                Tokyo.
              </div>
            </div>
          </div>

          {/* CTA */}

          <button
            type="button"
            onClick={handleOpenApp}
            disabled={authLoading}
            className="
              mt-8
              rounded-xl
              bg-gradient-to-br
              from-[#ff7a18]
              to-[#ff4d00]
              px-7
              py-3
              text-sm
              font-semibold
              text-white
              shadow-sm
              transition-all
              duration-200
              hover:-translate-y-0.5
              hover:shadow-[0_10px_28px_rgba(255,77,0,0.28)]
              focus:outline-none
              focus:ring-2
              focus:ring-[#ff7a18]/30
              active:translate-y-0
              disabled:cursor-wait
              disabled:opacity-60
              sm:px-8
              sm:py-3.5
              sm:text-base
            "
          >
            {authLoading ? "Checking..." : "Start asking"}
          </button>
        </div>
      </main>

      {/* ------------------------------------------------
          Login modal
      ------------------------------------------------- */}

      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onLoginSuccess={() => {
            setShowLogin(false);
            navigate("/app", { replace: true });
          }}
        />
      )}
    </div>
  );
}




// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   LogInIcon,
//   LogOutIcon,
//   MoonIcon,
//   SunDimIcon,
// } from "lucide-react";

// import { AuthProvider } from "../context/AuthContext.jsx";
// import LoginModal from "../components/LoginModel.jsx";
// import { useTheme } from "../context/ThemeContext.jsx";

// import logoDark from "../assets/LogoDark.png";
// import logoLight from "../assets/logoLight.png";

// export default function LandingPage() {
//   const [showLogin, setShowLogin] = useState(false);

//   const { isLoggedIn, logout } = AuthProvider.useAuth();
//   const { isDark, toggleTheme } = useTheme();

//   const navigate = useNavigate();

//   const handleStart = () => {
//     if (isLoggedIn) {
//       navigate("/app");
//       return;
//     }

//     setShowLogin(true);
//   };

//   return (
//     <div
//       className="
//         flex min-h-screen flex-col
//         bg-[#f8f9fb] text-[#111827]
//         dark:bg-[#0a0a0c] dark:text-[#f5f5f7]
//       "
//     >
//       {/* Header */}
//       <header
//         className="
//           flex h-16 w-full items-center justify-between
//           border-b border-[#e5e7eb]/80
//           bg-[#f8f9fb]/90 px-4
//           backdrop-blur-md
//           sm:px-6
//           lg:px-10
//           dark:border-[#26262c]
//           dark:bg-[#0a0a0c]/90
//         "
//       >
//         <button
//           type="button"
//           onClick={() => navigate("/")}
//           aria-label="Go to homepage"
//           className="shrink-0"
//         >
//           <img
//             src={isDark ? logoDark : logoLight}
//             alt="ZoomCon"
//             className="h-11 w-auto object-contain sm:h-12"
//           />
//         </button>

//         <div className="flex items-center gap-1.5 sm:gap-2">
//           {/* Theme */}
//           <button
//             type="button"
//             onClick={toggleTheme}
//             aria-label="Toggle theme"
//             title="Toggle theme"
//             className="
//               flex h-9 w-9 items-center justify-center rounded-lg
//               text-[#4b5563]
//               transition-all duration-200
//               hover:bg-[#eef0f3] hover:text-[#111827]
//               dark:text-[#9ca3af]
//               dark:hover:bg-[#202026]
//               dark:hover:text-[#f5f5f7]
//             "
//           >
//             {isDark ? (
//               <SunDimIcon size={19} />
//             ) : (
//               <MoonIcon size={19} />
//             )}
//           </button>

//           {/* Login / Logout */}
//           {isLoggedIn ? (
//             <button
//               type="button"
//               onClick={logout}
//               aria-label="Logout"
//               title="Logout"
//               className="
//                 flex h-9 w-9 items-center justify-center rounded-lg
//                 text-[#6b7280]
//                 transition-all duration-200
//                 hover:bg-red-50 hover:text-red-600
//                 dark:text-[#9ca3af]
//                 dark:hover:bg-red-500/10
//                 dark:hover:text-red-400
//               "
//             >
//               <LogOutIcon size={18} />
//             </button>
//           ) : (
//             <button
//               type="button"
//               onClick={() => setShowLogin(true)}
//               aria-label="Login"
//               title="Login"
//               className="
//                 flex h-9 w-9 items-center justify-center rounded-lg
//                 text-[#6b7280]
//                 transition-all duration-200
//                 hover:bg-[#eef0f3] hover:text-[#111827]
//                 dark:text-[#9ca3af]
//                 dark:hover:bg-[#202026]
//                 dark:hover:text-[#f5f5f7]
//               "
//             >
//               <LogInIcon size={18} />
//             </button>
//           )}
//         </div>
//       </header>

//       {/* Main */}
//       <main className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
//         <div className="flex w-full max-w-3xl flex-col items-center text-center">
//           {/* Eyebrow */}
//           <p
//             className="
//               mb-4 font-mono text-[11px] font-medium
//               uppercase tracking-[0.28em]
//               text-[#6b7280]
//               dark:text-[#8a8a92]
//             "
//           >
//             ask → answer
//           </p>

//           {/* Heading */}
//           <h1
//             className="
//               max-w-3xl
//               text-4xl font-bold leading-[1.08]
//               tracking-tight
//               text-[#111827]
//               sm:text-5xl
//               lg:text-6xl
//               dark:text-[#f5f5f7]
//             "
//           >
//             A chatbot that just answers.
//           </h1>

//           {/* Description */}
//           <p
//             className="
//               mt-5 max-w-xl
//               text-sm leading-6
//               text-[#6b7280]
//               sm:text-base sm:leading-7
//               dark:text-[#9ca3af]
//             "
//           >
//             Type a question. Get a generated answer. Nothing else in the way.
//           </p>

//           {/* Example chat */}
//           <div
//             className="
//               mt-10 w-full max-w-lg
//               rounded-2xl
//               border border-[#e5e7eb]
//               bg-white
//               p-4
//               text-left
//               shadow-[0_20px_60px_rgba(15,23,42,0.08)]
//               sm:mt-12 sm:p-5
//               dark:border-[#26262c]
//               dark:bg-[#141418]
//               dark:shadow-[0_20px_60px_rgba(0,0,0,0.35)]
//             "
//           >
//             {/* User message */}
//             <div className="flex justify-end">
//               <div
//                 className="
//                   max-w-[88%]
//                   rounded-2xl rounded-tr-sm
//                   bg-gradient-to-br from-[#ff7a18] to-[#ff4d00]
//                   px-4 py-2.5
//                   text-sm leading-5
//                   text-white
//                   shadow-sm
//                   sm:max-w-[80%]
//                 "
//               >
//                 What&apos;s the capital of Japan?
//               </div>
//             </div>

//             {/* Assistant message */}
//             <div className="mt-3 flex justify-start">
//               <div
//                 className="
//                   max-w-[88%]
//                   rounded-2xl rounded-tl-sm
//                   border border-[#e5e7eb]
//                   bg-[#f3f4f6]
//                   px-4 py-2.5
//                   text-sm leading-5
//                   text-[#374151]
//                   sm:max-w-[80%]
//                   dark:border-[#2a2a30]
//                   dark:bg-[#0f0f12]
//                   dark:text-[#e5e7eb]
//                 "
//               >
//                 Tokyo.
//               </div>
//             </div>
//           </div>

//           {/* CTA */}
//           <button
//             type="button"
//             onClick={handleStart}
//             className="
//               mt-8
//               rounded-xl
//               bg-gradient-to-br from-[#ff7a18] to-[#ff4d00]
//               px-7 py-3
//               text-sm font-semibold text-white
//               shadow-sm
//               transition-all duration-200
//               hover:-translate-y-0.5
//               hover:shadow-[0_10px_28px_rgba(255,77,0,0.28)]
//               focus:outline-none
//               focus:ring-2
//               focus:ring-[#ff7a18]/30
//               active:translate-y-0
//               sm:px-8 sm:py-3.5 sm:text-base
//             "
//           >
//             Start asking
//           </button>
//         </div>
//       </main>

//       {/* Login modal */}
//       {showLogin && (
//         <LoginModal
//           onClose={() => setShowLogin(false)}
//           onLoginSuccess={() => {
//             setShowLogin(false);
//             navigate("/app");
//           }}
//         />
//       )}
//     </div>
//   );
// }