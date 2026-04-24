import { getTrendingAnime, getPopularAnime, getTopRatedAnime, getSeasonalAnime } from "@/lib/anilist";
import ContentRow from "@/components/ContentRow";
import InfiniteScrollGrid from "@/components/InfiniteScrollGrid";
import { fetchAnimeAction } from "@/app/actions";

import { getSiteConfig } from "@/app/api/admin/site/route";

import ApiDownState from "@/components/ApiDownState";

export async function generateMetadata() {
  const config = await getSiteConfig();
  return { title: `Anime - ${config.siteName || "Film"}` };
}
export const revalidate = 3600;

export default async function AnimePage() {
  const currentYear = new Date().getFullYear();
  const currentSeason = ["WINTER","SPRING","SUMMER","FALL"][Math.floor((new Date().getMonth()) / 3)];

  const [trending, popular, topRated, seasonal] = await Promise.all([
    getTrendingAnime(),
    getPopularAnime(),
    getTopRatedAnime(),
    getSeasonalAnime(currentSeason, currentYear),
  ]);

  if (!trending?.length && !popular?.length) {
    return (
      <div className="min-h-screen bg-zinc-950 pt-32 pb-16">
        <ApiDownState provider="AniList" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 pt-20 pb-16">
      <div className="max-w-screen-2xl mx-auto">
        <div className="px-6 sm:px-8 py-6">
          <h1 className="text-3xl font-black text-white mb-1">Anime</h1>
          <p className="text-gray-400 text-sm">Watch the best anime series and movies</p>
        </div>
        <ContentRow title="Trending Now" items={trending || []} type="anime" />
        <ContentRow title={`${currentSeason} ${currentYear}`} items={seasonal || []} type="anime" />
        <div className="px-6 sm:px-8 mb-10 mt-6">
          <h2 className="text-xl font-bold text-white mb-6 border-l-4 border-red-600 pl-3">
            All Anime
          </h2>
          <InfiniteScrollGrid
            initialItems={popular || []}
            fetchAction={async (page) => {
              "use server";
              return fetchAnimeAction(page);
            }}
            type="anime"
          />
        </div>
        <ContentRow title="Top Rated All Time" items={topRated || []} type="anime" />
      </div>
    </div>
  );
}
