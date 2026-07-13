export default function Footer() {
  return (
    <footer className="zc-footer">
      <div className="zc-logo">
        Zoom<span className="zc-logo-accent">Con</span>
      </div>
      <p>© {new Date().getFullYear()} ZoomCon. Built for autonomous minds.</p>
      <div className="zc-footer-links">
        <a href="#privacy">Privacy</a>
        <a href="#terms">Terms</a>
        <a href="#contact">Contact</a>
      </div>
    </footer>
  );
}