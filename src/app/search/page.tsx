"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import { tmdbImg } from "@/lib/tmdb";
import { searchAnime } from "@/lib/anilist";
import type { AniListMedia } from "@/lib/anilist";
import type { SportMatch } from "@/lib/sport";

const TMDB_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const TMDB_BASE = process.env.NEXT_PUBLIC_TMDB_BASE_URL;

interface TMDBResult {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  media_type: string;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
}

const badgeCfg: Record<string, { label: string; cls: string }> = {
  movie: { label: "Movie", cls: "bg-red-600" },
  tv: { label: "TV", cls: "bg-blue-600" },
  anime: { label: "Anime", cls: "bg-purple-600" },
  sport: { label: "LIVE", cls: "bg-red-600" },
};

const proxyImg = (url: string) =>
  url ? `/api/img-proxy?src=${encodeURIComponent(url)}` : "";

function SearchContent() {
  const params = useSearchParams();
  const query = params.get("q") || "";
  const [tmdbResults, setTmdbResults] = useState<TMDBResult[]>([]);
  const [animeResults, setAnimeResults] = useState<AniListMedia[]>([]);
  const [sportResults, setSportResults] = useState<SportMatch[]>([]);
  const [filter, setFilter] = useState<"all" | "movie" | "tv" | "anime" | "sport">("all");
  const [loading, setLoading] = useState(false);
  const [siteName, setSiteName] = useState("Film");

  useEffect(() => {
    fetch("/api/admin/site")
      .then(r => r.json())
      .then(d => { if (d.logoText) setSiteName(d.logoText); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!query) return;
    setLoading(true);

    const fetchTMDB = fetch(
      `${TMDB_BASE}/search/multi?api_key=${TMDB_KEY}&query=${encodeURIComponent(query)}&language=en-US`
    ).then(r => r.json());

    // Fetch all live+upcoming matches, filter client-side by title
    const fetchSports = fetch(`/api/sports?type=all`)
      .then(r => r.json())
      .then((data: SportMatch[]) =>
        Array.isArray(data)
          ? data.filter(m => m.title?.toLowerCase().includes(query.toLowerCase()))
          : []
      )
      .catch(() => []);

    Promise.all([fetchTMDB, searchAnime(query), fetchSports])
      .then(([tmdb, anime, sports]) => {
        setTmdbResults((tmdb.results || []).filter((r: TMDBResult) => r.media_type !== "person" && r.poster_path));
        setAnimeResults((anime || []).filter((a: AniListMedia) => a.coverImage?.large));
        setSportResults(sports);
      })
      .finally(() => setLoading(false));
  }, [query]);

  type AllItem =
    | (TMDBResult & { _src: "tmdb" })
    | { id: number; media_type: "anime"; _src: "anilist"; _anime: AniListMedia }
    | (SportMatch & { _src: "sport"; media_type: "sport" });

  const allResults: AllItem[] = [
    ...tmdbResults.map(r => ({ ...r, _src: "tmdb" as const })),
    ...animeResults.map(a => ({ id: a.id, media_type: "anime" as const, _src: "anilist" as const, _anime: a })),
    ...sportResults.map(s => ({ ...s, _src: "sport" as const, media_type: "sport" as const })),
  ];

  const filtered = allResults.filter(r => filter === "all" || r.media_type === filter);

  const filterTabs = [
    { key: "all", label: "All" },
    { key: "movie", label: "Movies" },
    { key: "tv", label: "TV Shows" },
    { key: "anime", label: "Anime" },
    { key: "sport", label: "Sports" },
  ] as const;

  return (
    <div className="min-h-screen bg-zinc-950 pt-20 pb-16">
      <div className="max-w-screen-2xl mx-auto px-6 sm:px-8">
        {/* Header */}
        <div className="py-6">
          <div className="flex items-center gap-3 mb-1">
            <Search size={20} className="text-gray-400" />
            <h1 className="text-2xl font-bold text-white">
              {query ? `Search results for "${query}"` : "Search"}
            </h1>
          </div>
          {!loading && query && (
            <p className="text-gray-400 text-sm ml-8">{filtered.length} results found</p>
          )}
        </div>

        {/* Filter Tabs */}
        {query && (
          <div className="flex gap-2 mb-6 flex-wrap">
            {filterTabs.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all border ${
                  filter === key
                    ? "bg-red-600 text-white border-red-600"
                    : "bg-zinc-800 text-gray-300 border-zinc-700 hover:border-zinc-500"
                }`}
              >
                {label}
                {key === "sport" && sportResults.length > 0 && (
                  <span className="ml-1.5 bg-white/20 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                    {sportResults.length}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="aspect-poster bg-zinc-800 rounded-lg animate-pulse" />
            ))}
          </div>
        )}

        {/* Results */}
        {!loading && query && filtered.length > 0 && (
          <div className={`grid gap-4 ${
            // Sport results need wider cards (landscape), so use fewer columns
            filter === "sport"
              ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
              : filter === "all" && sportResults.length > 0
              ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
              : "grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7"
          }`}>
            {filtered.map((item, idx) => {
              // Anime card
              if (item._src === "anilist") {
                const a = (item as { _anime: AniListMedia })._anime;
                return (
                  <Link key={`anime-${a.id}-${idx}`} href={`/anime/${a.id}`} className="group block">
                    <div className="relative aspect-poster bg-zinc-800 rounded-lg overflow-hidden content-card">
                      <span className="absolute top-2 left-2 z-10 text-[10px] font-bold px-1.5 py-0.5 rounded text-white bg-purple-600">Anime</span>
                      <Image src={a.coverImage.large} alt={a.title.romaji} fill className="object-cover" sizes="160px" />
                    </div>
                    <p className="mt-2 text-xs text-gray-300 line-clamp-2">{a.title.english || a.title.romaji}</p>
                  </Link>
                );
              }

              // Sport card
              if (item._src === "sport") {
                const s = item as SportMatch;
                const isLive = s.status === "in" || s.status === "live";
                return (
                  <Link key={`sport-${s.matchId}-${idx}`} href={`/sport/${s.matchId}`} className="group block">
                    <div className="relative aspect-video bg-zinc-800 rounded-lg overflow-hidden content-card">
                      {isLive && (
                        <span className="absolute top-2 left-2 z-10 flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded text-white bg-red-600">
                          <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" /> LIVE
                        </span>
                      )}
                      {!isLive && (
                        <span className="absolute top-2 left-2 z-10 text-[10px] font-bold px-1.5 py-0.5 rounded text-white bg-zinc-700">Sport</span>
                      )}
                      {s.poster ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={proxyImg(s.poster)} alt={s.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center p-3">
                          <span className="text-zinc-500 text-xs text-center">{s.title}</span>
                        </div>
                      )}
                    </div>
                    <p className="mt-2 text-xs text-gray-300 line-clamp-2">{s.title}</p>
                    <p className="text-[10px] text-zinc-500 capitalize">{s.sport}</p>
                  </Link>
                );
              }

              // Movie / TV card
              const r = item as TMDBResult;
              const title = r.title || r.name || "";
              const href = r.media_type === "tv" ? `/tv/${r.id}` : `/movie/${r.id}`;
              const badge = badgeCfg[r.media_type] || badgeCfg.movie;
              return (
                <Link key={`${r.media_type}-${r.id}-${idx}`} href={href} className="group block">
                  <div className="relative aspect-poster bg-zinc-800 rounded-lg overflow-hidden content-card">
                    <span className={`absolute top-2 left-2 z-10 text-[10px] font-bold px-1.5 py-0.5 rounded text-white ${badge.cls}`}>{badge.label}</span>
                    {r.poster_path && (
                      <Image src={tmdbImg(r.poster_path, "w342")} alt={title} fill className="object-cover" sizes="160px" />
                    )}
                  </div>
                  <p className="mt-2 text-xs text-gray-300 line-clamp-2">{title}</p>
                </Link>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!loading && query && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Search size={48} className="text-zinc-600 mb-4" />
            <p className="text-white text-xl font-bold mb-2">No results found</p>
            <p className="text-gray-400 text-sm">Try different keywords or browse our categories</p>
          </div>
        )}

        {/* No query */}
        {!query && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Search size={64} className="text-zinc-700 mb-4" />
            <p className="text-white text-2xl font-bold mb-2">Search {siteName}</p>
            <p className="text-gray-400">Find movies, TV shows, anime & live sports</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-zinc-950 pt-20 flex items-center justify-center"><div className="text-white">Loading...</div></div>}>
      <SearchContent />
    </Suspense>
  );
}
