import { useEffect, useRef, useState } from "react";
import { Lock } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function TokenSizeSelect({ value, onChange, onProClick }) {
  const { tokenOptions: options, isPro, authLoading } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e) => {
      if (!menuRef.current?.contains(e.target)) setOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const selected = options.find(({ label }) => label === value) || options[0];

  if (authLoading || !options.length) {
    return (
      <div className="min-w-[8rem] rounded-lg border border-[#e5e5e8] bg-white px-3 py-2 text-xs text-[#6b6b73] dark:border-[#2a2a30] dark:bg-[#141418] dark:text-[#8a8a92]">
        Loading...
      </div>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="
          flex min-w-[8rem] items-center justify-between gap-2 rounded-lg
          border border-[#e5e5e8] bg-white px-3 py-2 text-sm font-medium
          text-[#1a1a1e] transition hover:border-[#ff7a18]
          dark:border-[#2a2a30] dark:bg-[#141418] dark:text-[#f5f5f7]
        "
      >
        <span>{selected?.label || "Select"}</span>
        <span
          className={`text-xs transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        >
          ▾
        </span>
      </button>

      {open && (
        <div
          className="
            absolute bottom-[calc(100%+8px)] left-0 z-50 w-44 rounded-xl border
            border-[#e5e5e8] bg-white p-1
            shadow-[0_20px_80px_rgba(0,0,0,0.15)]
            dark:border-[#26262c] dark:bg-[#141418]
            dark:shadow-[0_20px_80px_rgba(0,0,0,0.6)]
          "
        >
          {options.map(({ label }) => (
            <button
              key={label}
              type="button"
              onClick={() => {
                onChange(label);
                setOpen(false);
              }}
              className={`
                flex w-full items-center justify-between rounded-lg px-3 py-2
                text-sm transition
                ${
                  value === label
                    ? "bg-[#fff3eb] font-medium text-[#ff7a18] dark:bg-[#ff7a18]/10"
                    : "text-[#1a1a1e] hover:bg-[#eaeaec] dark:text-[#f5f5f7] dark:hover:bg-[#22222a]"
                }
              `}
            >
              {label}
            </button>
          ))}

          {!isPro && (
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                onProClick?.();
              }}
              className="
                flex w-full items-center justify-between rounded-lg px-3 py-2
                text-sm font-medium text-orange-500 transition
                hover:bg-orange-50 dark:hover:bg-orange-950/30
              "
            >
              Extended
              <Lock size={14} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}


// import { useEffect, useState, useRef } from "react";
// import { Lock } from "lucide-react";
// import { getTokenOptions } from "../../api/chat";

// export default function TokenSizeSelect({ value, onChange, onProClick }) {
//   const [options, setOptions] = useState([]);
//   const [isPro, setIsPro] = useState(false);
//   const [open, setOpen] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const menuRef = useRef(null);

//   useEffect(() => {
//     getTokenOptions()
//       .then((res) => {
//         setOptions(res.data.options);
//         setIsPro(res.data.isPro);
//       })
//       .catch((err) => console.error("Failed to load token options", err))
//       .finally(() => setLoading(false));
//   }, []);

//   // Close on outside click — same pattern as ChatHeader profile menu
//   useEffect(() => {
//     if (!open) return;
//     const handleClickOutside = (e) => {
//       if (menuRef.current && !menuRef.current.contains(e.target)) {
//         setOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [open]);

//   // selected label — compare label strings, not numbers
//   const selected = options.find((o) => o.label === value) || options[0];

//   if (loading) {
//     return (
//       <div className="min-w-[8rem] rounded-lg border border-[#e5e5e8] dark:border-[#2a2a30] bg-white dark:bg-[#141418] px-3 py-2 text-xs text-[#6b6b73] dark:text-[#8a8a92]">
//         Loading...
//       </div>
//     );
//   }

//   return (
//     <div className="relative" ref={menuRef}>
//       <button
//         type="button"
//         onClick={() => setOpen((prev) => !prev)}
//         className="
//           flex min-w-[8rem] items-center justify-between gap-2 rounded-lg
//           border border-[#e5e5e8] dark:border-[#2a2a30]
//           bg-white dark:bg-[#141418]
//           px-3 py-2 text-sm font-medium
//           text-[#1a1a1e] dark:text-[#f5f5f7]
//           hover:border-[#ff7a18] transition
//         "
//       >
//         <span>{selected?.label || "Select"}</span>
//         <span className={`text-xs transition-transform duration-200 ${open ? "rotate-180" : ""}`}>▾</span>
//       </button>

//       {open && (
//         <div
//           className="
//             absolute bottom-[calc(100%+8px)] left-0 z-50 w-44 rounded-xl border
//             border-[#e5e5e8] dark:border-[#26262c]
//             bg-white dark:bg-[#141418] p-1
//             shadow-[0_20px_80px_rgba(0,0,0,0.15)]
//             dark:shadow-[0_20px_80px_rgba(0,0,0,0.6)]
//           "
//         >
//           {options.map((option) => (
//             <button
//               key={option.label}
//               type="button"
//               onClick={() => {
//                 onChange(option.label);
//                 setOpen(false);
//               }}
//               className={`
//                 flex w-full items-center justify-between
//                 rounded-lg px-3 py-2 text-sm transition
//                 ${value === option.label
//                   ? "bg-[#fff3eb] dark:bg-[#ff7a18]/10 text-[#ff7a18] font-medium"
//                   : "text-[#1a1a1e] dark:text-[#f5f5f7] hover:bg-[#eaeaec] dark:hover:bg-[#22222a]"}
//               `}
//             >
//               {option.label}
//             </button>
//           ))}

//           {/* Extended option — shown locked for non-pro users */}
//           {!isPro && (
//             <button
//               type="button"
//               onClick={() => {
//                 setOpen(false);
//                 onProClick?.();
//               }}
//               className="
//                 flex w-full items-center justify-between
//                 rounded-lg px-3 py-2 text-sm font-medium
//                 text-orange-500
//                 hover:bg-orange-50 dark:hover:bg-orange-950/30
//                 transition
//               "
//             >
//               Extended
//               <Lock size={14} />
//             </button>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }


// // import { useEffect, useState } from "react";
// // import { Lock } from "lucide-react";
// // import { getTokenOptions } from "../../api/chat";

// // export default function TokenSizeSelect({ value, onChange, onProClick }) {
// //   const [options, setOptions] = useState([]);
// //   const [isPro, setIsPro] = useState(false);
// //   const [open, setOpen] = useState(false);
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     const fetchOptions = async () => {
// //       try {
// //         const response = await getToken Options();

// //         setOptions(response.data.options);
// //         setIsPro(response.data.isPro);
// //       } catch (error) {
// //         console.error("Failed to load token options", error);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchOptions();
// //   }, []);

// //   const selected =
// //     options.find((option) => option.label === value) || options[0];

// //   if (loading) {
// //     return (
// //       <div className="w-39 rounded-lg border border-[#e5e5e8] px-3 py-2 text-sm">
// //         Loading...
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="relative">
// //       <button
// //         type="button"
// //         onClick={() => setOpen((prev) => !prev)}
// //         className="
// //           flex w-39 items-center justify-center gap-2 rounded-lg
// //           border border-[#e5e5e8] dark:border-[#2a2a30]
// //           bg-white dark:bg-[#141418]
// //           px-3 py-2 text-sm font-bold
// //           text-[#1a1a1e] dark:text-[#f5f5f7]
// //           hover:border-[#ff7a18] transition
// //         "
// //       >
// //         {selected?.label || "Select"}
// //         <span className="absolute right-4 rotate-180 text-xl">
// //           ▾
// //         </span>
// //       </button>

// //       {open && (
// //         <div
// //           className="
// //             absolute bottom-11 left-0 w-44 rounded-xl border
// //             border-[#e5e5e8] dark:border-[#26262c]
// //             bg-white dark:bg-[#141418] p-1
// //             shadow-[0_20px_80px_rgba(0,0,0,0.15)]
// //             dark:shadow-[0_20px_80px_rgba(0,0,0,0.6)]
// //           "
// //         >
// //           {options.map((option) => (
// //             <button
// //               key={option.label}
// //               type="button"
// //               onClick={() => {
// //                 onChange(option.label);
// //                 setOpen(false);
// //               }}
// //               className="
// //                 flex w-full items-center justify-between
// //                 rounded-lg px-3 py-2 text-sm
// //                 text-[#1a1a1e] dark:text-[#f5f5f7]
// //                 hover:bg-[#eaeaec] dark:hover:bg-[#22222a]
// //                 transition
// //               "
// //             >
// //               {option.label}
// //             </button>
// //           ))}

// //           {!isPro && (
// //             <button
// //               type="button"
// //               onClick={() => {
// //                 setOpen(false);
// //                 onProClick?.();
// //               }}
// //               className="
// //                 flex w-full items-center justify-between
// //                 rounded-lg px-3 py-2 text-sm
// //                 font-semibold text-orange-600
// //                 hover:bg-orange-50
// //                 dark:hover:bg-orange-950/30
// //               "
// //             >
// //               Extended
// //               <Lock size={14} />
// //             </button>
// //           )}
// //         </div>
// //       )}
// //     </div>
// //   );
// // }