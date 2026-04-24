export default function SkeletonCard() {
  return (
    <div className="w-full">
      <div className="relative aspect-poster rounded-xl overflow-hidden bg-zinc-800 animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-shimmer" />
      </div>
      <div className="mt-2 space-y-2">
        <div className="h-3 w-3/4 bg-zinc-800 rounded animate-pulse" />
        <div className="h-2 w-1/2 bg-zinc-800 rounded animate-pulse" />
      </div>
    </div>
  );
}
