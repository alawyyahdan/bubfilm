import { getSiteConfig } from "@/app/api/admin/site/route";

export default function SportsPageLoading() {
  const config = getSiteConfig();
  const siteName = config.logoText || "Film";

  return (
    <div className="fixed inset-0 z-[1000] bg-zinc-950 flex flex-col items-center justify-center">
      {config.logoType === "image" && config.logoImageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={config.logoImageUrl || undefined} alt="Loading..." className="h-12 w-auto object-contain animate-pulse mb-8" />
      ) : (
        <h1 className="text-4xl sm:text-5xl font-black text-red-600 tracking-[0.3em] uppercase animate-pulse mb-8">
          {siteName}
        </h1>
      )}
      
      <div className="flex gap-2">
        <div className="w-3 h-3 rounded-full bg-red-600 animate-bounce" style={{ animationDelay: "0s" }} />
        <div className="w-3 h-3 rounded-full bg-red-600 animate-bounce" style={{ animationDelay: "0.2s" }} />
        <div className="w-3 h-3 rounded-full bg-red-600 animate-bounce" style={{ animationDelay: "0.4s" }} />
      </div>
    </div>
  );
}
