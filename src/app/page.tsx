import {
  getTrending, getPopularMovies, getNowPlayingMovies,
  getTopRatedMovies, getPopularTV, getTopRatedTV, getVideos,
} from "@/lib/tmdb";
import { getTrendingAnime, getPopularAnime } from "@/lib/anilist";
import { getLiveMatches } from "@/lib/sport";
import { getSiteConfig } from "@/app/api/admin/site/route";
import HeroBanner from "@/components/HeroBanner";
import ContentRow from "@/components/ContentRow";
import SportsRow from "@/components/SportsRow";
import BannerAd from "@/components/BannerAd";

export default async function HomePage() {
  const [
    trending, popularMovies, nowPlaying, topRatedMovies,
    popularTV, topRatedTV, trendingAnime, popularAnime, liveMatches, siteConfig
  ] = await Promise.all([
    getTrending("all", "day"),
    getPopularMovies(),
    getNowPlayingMovies(),
    getTopRatedMovies(),
    getPopularTV(),
    getTopRatedTV(),
    getTrendingAnime(),
    getPopularAnime(),
    getLiveMatches(),
    getSiteConfig(),
  ]);

  // Pick top 8 for hero and fetch their trailers in parallel
  const heroRaw = (trending.results || []).slice(0, 8).map((item: Record<string, unknown>) => ({
    ...item,
    media_type: item.media_type || "movie",
  }));

  const videoKeys = await Promise.all(
    heroRaw.map(async (item: Record<string, unknown>) => {
      try {
        const type = item.media_type === "tv" ? "tv" : "movie";
        const vids = await getVideos(type as "movie" | "tv", item.id as number);
        const trailer = (vids.results || []).find(
          (v: { type: string; site: string; key: string }) =>
            (v.type === "Trailer" || v.type === "Teaser") && v.site === "YouTube"
        );
        return trailer?.key || null;
      } catch {
        return null;
      }
    })
  );

  const heroItems = heroRaw.map((item: Record<string, unknown>, i: number) => ({
    ...item,
    videoKey: videoKeys[i],
  }));

  return (
    <div className="min-h-screen bg-zinc-950">
      <HeroBanner items={heroItems} siteName={siteConfig?.logoText} />
      <div className="relative z-30 -mt-24 pb-16 pt-12 bg-gradient-to-t from-zinc-950 via-zinc-950 to-transparent">
        <BannerAd location="home" rowIndex={0} />
        
        {liveMatches && liveMatches.length > 0 && (
          <SportsRow title="Live Sports" items={liveMatches} seeAllHref="/sports" />
        )}

        <ContentRow title="Top 10 Content Today" seeAllHref="/movies" items={(trending.results || []).slice(0, 15)} />
        
        <BannerAd location="home" rowIndex={1} />
        <ContentRow title="Trending Movies" seeAllHref="/movies" items={popularMovies.results || []} type="movie" />
        
        <BannerAd location="home" rowIndex={2} />
        <ContentRow title="Top Rated Movies" seeAllHref="/movies" items={topRatedMovies.results || []} type="movie" />
      </div>
    </div>
  );
}
