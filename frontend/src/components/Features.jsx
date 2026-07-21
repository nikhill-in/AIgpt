const FEATURES = [
  {
    icon: "⚡",
    title: "Autonomous Agents",
    desc: "Spin up self-operating agents that act on live signals without babysitting.",
  },
  {
    icon: "📊",
    title: "Live Monitoring",
    desc: "Real-time dashboards for liquidity pools, prices, and on-chain events.",
  },
  {
    icon: "🎙️",
    title: "Voice Commands",
    desc: "Talk to ZoomCon. Natural-language control over every deployment.",
  },
  {
    icon: "🔒",
    title: "Secure by Default",
    desc: "Encrypted sessions, gated actions, and full audit logging.",
  },
  {
    icon: "🧠",
    title: "Multi-Model",
    desc: "Swap between models mid-conversation for cost or capability.",
  },
  {
    icon: "♻️",
    title: "Regenerate & Edit",
    desc: "Retry, refine, and branch responses without losing history.",
  },
];

export default function Features() {
  return (
    <section
      id="features"
      className="
        relative z-[2]
        mx-auto
        w-full
        max-w-[1100px]
        px-[6vw]
        py-[60px]
        pb-[90px]
      "
    >
      <h2
        className="
          mb-[42px]
          text-center
          text-[clamp(1.6rem,4vw,2.4rem)]
          font-bold
        "
      >
        Everything your bot needs
      </h2>

      <div
        className="
          grid
          grid-cols-[repeat(auto-fit,minmax(260px,1fr))]
          gap-5

          max-[600px]:grid-cols-1
        "
      >
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className="
              rounded-2xl
              border
              border-[#222228]
              bg-[#141418]
              p-7
              transition-all
              duration-[250ms]

              hover:-translate-y-1
              hover:border-orange-500/50
              hover:shadow-[0_12px_40px_rgba(0,0,0,0.5)]
            "
          >
            <span className="text-[1.8rem]">
              {f.icon}
            </span>

            <h3 className="mt-[14px] mb-2 font-semibold">
              {f.title}
            </h3>

            <p
              className="
                text-[0.92rem]
                leading-[1.5]
                text-[#8a8a92]
              "
            >
              {f.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}