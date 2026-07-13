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
      <div className="zc-app">
        <div className="zc-glow-bg" />
        <Navbar onLoginClick={() => setShowLogin(true)} />
        <Hero
          onRequireLogin={(prompt) => {
            setPendingPrompt(prompt);
            setShowLogin(true);
          }}
        />
        <Features />
        <Footer />

        {showLogin && (
          <LoginModal
            pendingPrompt={pendingPrompt}
            onClose={() => setShowLogin(false)}
          />
        )}
      </div>
    </AuthProvider>
  );
}