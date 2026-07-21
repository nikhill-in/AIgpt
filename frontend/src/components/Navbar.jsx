import { useAuth } from "../context/AuthContext";

export default function Navbar({ onLoginClick }) {
  const { isLoggedIn, user, logout } = useAuth();

  return (
    <nav
      className="
        relative
        z-[2]
        flex
        items-center
        justify-between
        gap-4
        px-[6vw]
        py-5
        flex-wrap

        max-[640px]:px-5
      "
    >
      {/* Logo */}
      <div className="flex items-center gap-[10px] text-[1.4rem] font-bold text-[#f5f5f7]">
        <span>
          Zoom<span className="text-[#ff7a18]">Con</span>
        </span>

        <span
          className="
            h-[18px]
            w-[18px]
            rounded-full
            bg-[radial-gradient(circle_at_30%_30%,#ffd9a0,var(--zc-orange-deep))]
            shadow-[0_0_14px_var(--zc-orange)]
          "
        />
      </div>

      {/* Navigation Links */}
      <ul
        className="
          flex
          list-none
          gap-7

          max-[640px]:order-3
          max-[640px]:w-full
          max-[640px]:justify-center
        "
      >
        <li>
          <a
            href="#features"
            className="
              text-[#8a8a92]
              no-underline
              transition-colors
              duration-200
              hover:text-[#f5f5f7]
            "
          >
            Features
          </a>
        </li>

        {/* 
        <li>
          <a href="#pricing">Pricing</a>
        </li>

        <li>
          <a href="#docs">Docs</a>
        </li>
        */}
      </ul>

      {/* Authentication */}
      {isLoggedIn ? (
        <div
          className="
            flex
            items-center
            gap-3
            text-[0.9rem]

            max-[480px]:w-full
            max-[480px]:justify-end
          "
        >
          <span className="max-w-[180px] truncate text-[#f5f5f7]">
            {user.email}
          </span>

          <button
            className="
              rounded-[10px]
              border
              border-[#33333a]
              bg-transparent
              px-4
              py-2
              text-[#8a8a92]
              transition
              duration-200
              hover:border-[#ff7a18]
              hover:text-[#f5f5f7]
            "
            onClick={logout}
          >
            Logout
          </button>
        </div>
      ) : (
        <button
          className="
            rounded-[10px]
            bg-gradient-to-br
            from-[#ff7a18]
            to-[#ff4d00]
            px-[22px]
            py-[10px]
            font-semibold
            text-white
            transition
            duration-200
            hover:-translate-y-px
            hover:shadow-[0_6px_24px_rgba(255,77,0,0.4)]

            max-[480px]:px-4
            max-[480px]:py-2
          "
          onClick={onLoginClick}
        >
          Sign In
        </button>
      )}
    </nav>
  );
}