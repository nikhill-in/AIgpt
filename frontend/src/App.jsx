import { useState } from "react";

import Features from "./components/Features.jsx";
import "./styles/global.css";
import { AuthProvider } from "./context/AuthContext.jsx";
import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import Footer from "./components/Footer.jsx";
import LoginModal from "./components/LoginModel.jsx";

export default function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [pendingPrompt, setPendingPrompt] = useState("");

  return (
    <AuthProvider>
      <div className="min-h-screen overflow-x-hidden bg-[#0a0a0c] text-[#f5f5f7]">
        <Navbar onLoginClick={() => setShowLogin(true)} />

        <Hero
          onRequireLogin={(prompt) => {
            setPendingPrompt(prompt);
            setShowLogin(true);
          }}
        />

        <Features />

        {showLogin && (
          <LoginModal
            pendingPrompt={pendingPrompt}
            onClose={() => setShowLogin(false)}
          />
        )}

        <Footer />
      </div>
    </AuthProvider>
  );
}