export default function MessageBubble({ role, content }) {
  const isUser = role === "user";

  return (
    <div className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`
          max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-6
          ${isUser
            ? "bg-gradient-to-br from-[#ff7a18] to-[#ff4d00] text-white"
            : "border border-[#26262c] bg-[#141418] text-[#f5f5f7] dark:bg-[#141418]"}
        `}
      >
        {content}
      </div>
    </div>
  );
}