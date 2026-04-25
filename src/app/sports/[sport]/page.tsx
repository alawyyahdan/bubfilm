import { getSports } from "@/lib/sport";
import LazySportSection from "@/components/LazySportSection";
import BannerAd from "@/components/BannerAd";
import SportFilter from "@/components/SportFilter";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

const sportEmoji: Record<string, string> = {
  football: "⚽", basketball: "🏀", baseball: "⚾", hockey: "🏒",
  tennis: "🎾", rugby: "🏉", cricket: "🏏", "american-football": "🏈",
  volleyball: "🏐", golf: "⛳", fighting: "🥊", mma: "🥊", darts: "🎯",
  racing: "🏎️", default: "🏆",
};

export async function generateMetadata({ params }: { params: Promise<{ sport: string }> }): Promise<Metadata> {
  const { sport } = await params;
  const isLive = sport.toLowerCase() === "live";
  const displayName = isLive ? "Matches" : sport.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
  return {
    title: `${sportEmoji[sport] || "🔥"} Live ${displayName}`,
    description: `Watch live ${displayName} matches and upcoming schedule.`,
  };
}

export default async function SportCategoryPage({ params }: { params: Promise<{ sport: string }> }) {
  const { sport } = await params;
  const sports = await getSports();
  const validSport = sports.find(s => s.name === sport);
  const isLiveRoute = sport.toLowerCase() === "live";
  const displayName = isLiveRoute
    ? "Live Matches"
    : (validSport?.displayName || sport.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase()));
  const emoji = sportEmoji[sport] || sportEmoji.default;

  return (
    <div className="min-h-screen bg-zinc-950 pt-24 pb-16">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="px-4 sm:px-6 lg:px-10 mb-6 pb-2">
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            {displayName}
          </h1>
          <p className="text-zinc-400 mt-2 text-sm">Live & upcoming {displayName}.</p>
        </div>

        {/* Category Filter */}
        <SportFilter activeSport={sport} />

        <BannerAd location="detail" rowIndex={0} />

        {/* 🔥 Live — grid, lazy, live only */}
        <LazySportSection
          title={isLiveRoute ? "All Live Matches" : `Live ${displayName}`}
          emoji="🔥"
          sport={sport}
          type="live"
          layout="grid"
          liveOnly
        />

        {/* All matches — grid, lazy, live sorted first */}
        <LazySportSection
          title={`All ${displayName} Matches`}
          emoji={emoji}
          sport={sport}
          type="all"
          layout="grid"
          liveFirst
        />
      </div>
    </div>
  );
}
