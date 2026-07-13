import { useAuth } from "../context/AuthContext";

export default function Navbar({ onLoginClick }) {
  const { isLoggedIn, user, logout } = useAuth();

  return (
    <nav className="zc-nav">
      <div className="zc-logo">
        <span className="zc-logo-orb" />
        Zoom<span className="zc-logo-accent">Con</span>
      </div>

      <ul className="zc-nav-links">
        <li><a href="#features">Features</a></li>
        <li><a href="#pricing">Pricing</a></li>
        <li><a href="#docs">Docs</a></li>
      </ul>

      {isLoggedIn ? (
        <div className="zc-nav-user">
          <span>{user.email}</span>
          <button className="zc-btn-ghost" onClick={logout}>Logout</button>
        </div>
      ) : (
        <button className="zc-btn-primary" onClick={onLoginClick}>
          Sign In
        </button>
      )}
    </nav>
  );
}