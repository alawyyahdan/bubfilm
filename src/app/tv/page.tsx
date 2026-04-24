import {
  getPopularTV,
  getTopRatedTV,
  getAiringTodayTV,
  getTVGenres,
  discoverTV,
} from "@/lib/tmdb";
import ContentRow from "@/components/ContentRow";
import GenreFilter from "@/components/GenreFilter";
import InfiniteScrollGrid from "@/components/InfiniteScrollGrid";
import { fetchTVAction } from "@/app/actions";

import { getSiteConfig } from "@/app/api/admin/site/route";
import ApiDownState from "@/components/ApiDownState";

export async function generateMetadata() {
  const config = await getSiteConfig();
  return { title: `TV Shows - ${config.siteName || "Film"}` };
}
export const revalidate = 3600;

interface Props {
  searchParams: Promise<{ genre?: string }>;
}

export default async function TVShowsPage({ searchParams }: Props) {
  const params = await searchParams;
  const genreId = params.genre ? Number(params.genre) : null;

  const [popular, topRated, airingToday, genresData, filtered] = await Promise.all([
    getPopularTV(),
    getTopRatedTV(),
    getAiringTodayTV(),
    getTVGenres(),
    genreId ? discoverTV(genreId) : Promise.resolve(null),
  ]);

  if (!popular?.results?.length && !topRated?.results?.length) {
    return (
      <div className="min-h-screen bg-zinc-950 pt-32 pb-16">
        <ApiDownState provider="TMDB" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 pt-20 pb-16">
      <div className="max-w-screen-2xl mx-auto">
        <div className="px-6 sm:px-8 py-6">
          <h1 className="text-3xl font-black text-white mb-1">TV Shows</h1>
          <p className="text-gray-400 text-sm">Binge-worthy shows from around the world</p>
        </div>

        <GenreFilter genres={genresData.genres || []} type="tv" />

        {genreId && filtered ? (
          <div className="px-6 sm:px-8 mt-6">
            <h2 className="text-xl font-bold text-white mb-6 border-l-4 border-red-600 pl-3">
              Filtered Results
            </h2>
            <InfiniteScrollGrid
              initialItems={filtered.results || []}
              fetchAction={async (page) => {
                "use server";
                return fetchTVAction(page, genreId);
              }}
              type="tv"
            />
          </div>
        ) : (
          <div className="mt-6">
            <div className="px-6 sm:px-8 mb-10">
              <h2 className="text-xl font-bold text-white mb-6 border-l-4 border-red-600 pl-3">
                All TV Shows
              </h2>
              <InfiniteScrollGrid
                initialItems={popular.results || []}
                fetchAction={async (page) => {
                  "use server";
                  return fetchTVAction(page, null);
                }}
                type="tv"
              />
            </div>
            <ContentRow title="Airing Today" items={airingToday.results || []} type="tv" />
            <ContentRow title="Top Rated Shows" items={topRated.results || []} type="tv" />
          </div>
        )}
      </div>
    </div>
  );
}
