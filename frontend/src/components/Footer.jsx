export default function Footer() {
  return (
    <footer
      className="
        relative z-[2]
        flex flex-wrap
        items-center
        justify-between
        gap-4
        border-t
        border-[#222228]
        px-[6vw]
        py-6
        text-sm
        text-[#8a8a92]

        max-[640px]:flex-col
        max-[640px]:text-center
      "
    >
      <div className="flex items-center gap-[10px] text-[1.4rem] font-bold text-[#f5f5f7]">
        Zoom
        <span className="text-[#ff7a18]">Con</span>
      </div>

      <p>
        © {new Date().getFullYear()} ZoomCon. Built for autonomous minds.
      </p>

      <div className="flex gap-6">
        <a
          href="#privacy"
          className="transition-colors duration-200 hover:text-[#f5f5f7]"
        >
          Privacy
        </a>

        <a
          href="#terms"
          className="transition-colors duration-200 hover:text-[#f5f5f7]"
        >
          Terms
        </a>

        <a
          href="#contact"
          className="transition-colors duration-200 hover:text-[#f5f5f7]"
        >
          Contact
        </a>
      </div>
    </footer>
  );
}