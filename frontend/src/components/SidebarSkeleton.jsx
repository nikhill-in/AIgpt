export default function SidebarSkeleton() {
  const rows = [1, 2, 3];

  return (
    <div className="px-1">
      {/* Starred heading */}
      <div className="mb-2 flex items-center justify-between px-2 py-2">
        <div className="h-3 w-16 animate-pulse rounded bg-gray-200 dark:bg-[#29292f]" />
        <div className="h-3 w-3 animate-pulse rounded bg-gray-200 dark:bg-[#29292f]" />
      </div>

      {rows.slice(0, 2).map((item) => (
        <SkeletonChat key={`starred-${item}`} />
      ))}

      {/* Recent heading */}
      <div className="mt-4 px-2 pb-2">
        <div className="h-3 w-14 animate-pulse rounded bg-gray-200 dark:bg-[#29292f]" />
      </div>

      {rows.map((item) => (
        <SkeletonChat key={`recent-${item}`} />
      ))}
    </div>
  );
}

function SkeletonChat() {
  return (
    <div className="flex h-10 items-center gap-1 rounded-xl px-2">
      <div className="h-3 flex-1 animate-pulse rounded bg-gray-200 dark:bg-[#29292f]" />

      <div className="h-7 w-7 animate-pulse rounded-lg bg-gray-200 dark:bg-[#29292f]" />
      <div className="h-7 w-7 animate-pulse rounded-lg bg-gray-200 dark:bg-[#29292f]" />
      <div className="h-7 w-7 animate-pulse rounded-lg bg-gray-200 dark:bg-[#29292f]" />
    </div>
  );
}