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
    if (pendingPrompt) console.log("Resume prompt after login:", pendingPrompt);
  };

  return (
    <div className="zc-modal-overlay" onClick={onClose}>
      <div className="zc-modal" onClick={(e) => e.stopPropagation()}>
        <button className="zc-modal-close" onClick={onClose}>✕</button>
        <div className="zc-orb zc-orb-sm" />
        <h2>Welcome to ZoomCon</h2>
        {pendingPrompt && (
          <p className="zc-modal-note">Sign in to run: “{pendingPrompt}”</p>
        )}
        <form onSubmit={handleSubmit} className="zc-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="zc-btn-primary zc-btn-full">
            Sign In
          </button>
        </form>
        <p className="zc-modal-alt">No account? <a href="#signup">Create one</a></p>
      </div>
    </div>
  );
}