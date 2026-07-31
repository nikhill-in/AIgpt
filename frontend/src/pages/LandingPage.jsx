import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Features from "../components/Features.jsx";
import Navbar from "../components/Navbar.jsx";
import Hero from "../components/Hero.jsx";
import Footer from "../components/Footer.jsx";
import LoginModal from "../components/LoginModel.jsx";
import Sidebar from "../components/Sidebar.jsx";

export default function LandingPage() {
  const [showLogin, setShowLogin] = useState(false);
  const [pendingPrompt, setPendingPrompt] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onSelectChat={(id) => {
          console.log("Load chat:", id);
          setSidebarOpen(false);
        }}
      />
      <Navbar
        onSidebarToggle={() => setSidebarOpen((prev) => !prev)}
        onLoginClick={() => setShowLogin(true)}
      />

      <Hero
        onRequireLogin={(prompt) => {
          if (isLoggedIn) {
            navigate("/app");
            return;
          }
          setPendingPrompt(prompt);
          setShowLogin(true);
        }}
      />

      <Features />

      {showLogin && (
        <LoginModal
          pendingPrompt={pendingPrompt}
          onClose={() => setShowLogin(false)}
          onLoginSuccess={() => {
            setShowLogin(false);
            navigate("/app");
          }}
        />
      )}

      <Footer />
    </>
  );
}