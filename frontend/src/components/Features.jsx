const FEATURES = [
  { icon: "⚡", title: "Autonomous Agents", desc: "Spin up self-operating agents that act on live signals without babysitting." },
  { icon: "📊", title: "Live Monitoring", desc: "Real-time dashboards for liquidity pools, prices, and on-chain events." },
  { icon: "🎙️", title: "Voice Commands", desc: "Talk to ZoomCon. Natural-language control over every deployment." },
  { icon: "🔒", title: "Secure by Default", desc: "Encrypted sessions, gated actions, and full audit logging." },
  { icon: "🧠", title: "Multi-Model", desc: "Swap between models mid-conversation for cost or capability." },
  { icon: "♻️", title: "Regenerate & Edit", desc: "Retry, refine, and branch responses without losing history." },
];

export default function Features() {
  return (
    <section id="features" className="zc-features">
      <h2 className="zc-section-title">Everything your bot needs</h2>
      <div className="zc-feature-grid">
        {FEATURES.map((f) => (
          <div key={f.title} className="zc-feature-card">
            <span className="zc-feature-icon">{f.icon}</span>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}