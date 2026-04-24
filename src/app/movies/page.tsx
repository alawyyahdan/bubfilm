import {
  getPopularMovies,
  getNowPlayingMovies,
  getTopRatedMovies,
  getUpcomingMovies,
  getMovieGenres,
  discoverMovies,
  getTrending,
} from "@/lib/tmdb";
import { getSiteConfig } from "@/app/api/admin/site/route";
import HeroBanner from "@/components/HeroBanner";
import ContentRow from "@/components/ContentRow";
import GenreFilter from "@/components/GenreFilter";
import InfiniteScrollGrid from "@/components/InfiniteScrollGrid";
import { fetchMoviesAction } from "@/app/actions";

export async function generateMetadata() {
  const config = await getSiteConfig();
  return { title: `Movies - ${config.siteName || "Film"}` };
}
export const revalidate = 3600; // Auto update every hour

interface Props {
  searchParams: Promise<{ genre?: string }>;
}

export default async function MoviesPage({ searchParams }: Props) {
  const params = await searchParams;
  const genreId = params.genre ? Number(params.genre) : null;

  const [popular, nowPlaying, topRated, upcoming, genresData, filtered, siteConfig, trending] = await Promise.all([
    getPopularMovies(),
    getNowPlayingMovies(),
    getTopRatedMovies(),
    getUpcomingMovies(),
    getMovieGenres(),
    genreId ? discoverMovies(genreId) : Promise.resolve(null),
    getSiteConfig(),
    getTrending("movie", "week"),
  ]);

  return (
    <div className="min-h-screen bg-zinc-950 pt-20 pb-16">
      <div className="max-w-screen-2xl mx-auto">
        <div className="px-6 sm:px-8 py-6">
          <h1 className="text-3xl font-black text-white mb-1">Movies</h1>
          <p className="text-gray-400 text-sm">Discover thousands of movies across all genres</p>
        </div>
        {/* Genre Filter */}
        <GenreFilter genres={genresData.genres || []} type="movie" />

        {genreId && filtered ? (
          <div className="px-6 sm:px-8 mt-6">
            <h2 className="text-xl font-bold text-white mb-6 border-l-4 border-red-600 pl-3">
              Filtered Results
            </h2>
            <InfiniteScrollGrid
              initialItems={filtered.results || []}
              fetchAction={async (page) => {
                "use server";
                return fetchMoviesAction(page, genreId);
              }}
              type="movie"
            />
          </div>
        ) : (
          <div className="mt-6">
            <div className="px-6 sm:px-8 mb-10">
              <h2 className="text-xl font-bold text-white mb-6 border-l-4 border-red-600 pl-3">
                All Movies
              </h2>
              <InfiniteScrollGrid
                initialItems={popular.results || []}
                fetchAction={async (page) => {
                  "use server";
                  return fetchMoviesAction(page, null);
                }}
                type="movie"
              />
            </div>
            <ContentRow title="Now Playing" items={nowPlaying.results || []} type="movie" />
            <ContentRow title="Top Rated" items={topRated.results || []} type="movie" />
            <ContentRow title="Coming Soon" items={upcoming.results || []} type="movie" />
          </div>
        )}
      </div>
    </div>
  );
}
