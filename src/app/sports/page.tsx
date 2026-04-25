import { getLiveMatches, getSports } from "@/lib/sport";
import LazySportSection from "@/components/LazySportSection";
import BannerAd from "@/components/BannerAd";
import SportFilter from "@/components/SportFilter";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sports - Live & Upcoming Matches",
  description: "Watch live sports, football, basketball, cricket, and more.",
};

// Emoji map for each sport
const sportEmoji: Record<string, string> = {
  football: "⚽",
  basketball: "🏀",
  baseball: "⚾",
  hockey: "🏒",
  tennis: "🎾",
  rugby: "🏉",
  cricket: "🏏",
  "american-football": "🏈",
  volleyball: "🏐",
  golf: "⛳",
  fighting: "🥊",
  mma: "🥊",
  racing: "🏎️",
  default: "🏆",
};

export default async function SportsPage() {
  // Only fetch live matches + sport list upfront (lightweight)
  const [liveMatches, sports] = await Promise.all([
    getLiveMatches(),
    getSports()
  ]);

  return (
    <div className="min-h-screen bg-zinc-950 pt-24 pb-16">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="px-4 sm:px-6 lg:px-10 mb-6 pb-2">
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            Sports
          </h1>
          <p className="text-zinc-400 mt-2 text-sm sm:text-base">
            Live & upcoming matches across all sports.
          </p>
        </div>

        {/* Category Filter */}
        <SportFilter />

        <BannerAd location="home" rowIndex={5} />

        {/* 🔥 ALL LIVE — data already fetched, no lazy needed */}
        {liveMatches.length > 0 && (
          <LazySportSection
            title="Live Now"
            emoji="🔥"
            seeAllHref="/sports/live"
            initialData={liveMatches}
            liveOnly
          />
        )}

        {/* Per-sport sections — lazy loaded via IntersectionObserver */}
        {sports.map((sport) => (
          <LazySportSection
            key={sport.name}
            title={sport.displayName}
            emoji={sportEmoji[sport.name] || sportEmoji.default}
            sport={sport.name}
            type="all"
            seeAllHref={`/sports/${sport.name}`}
            liveFirst
          />
        ))}
      </div>
    </div>
  );
}
