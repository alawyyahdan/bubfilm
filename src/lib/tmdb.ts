// TMDB API Client
const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY!;
const BASE_URL = process.env.NEXT_PUBLIC_TMDB_BASE_URL!;
export const IMG_BASE = process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE!;

export function tmdbImg(path: string | null, size = "w500") {
  if (!path) return "/placeholder-poster.jpg";
  return `${IMG_BASE}/${size}${path}`;
}

async function fetcher(path: string, params: Record<string, string> = {}) {
  const url = new URL(`${BASE_URL}${path}`);
  url.searchParams.set("api_key", API_KEY);
  url.searchParams.set("language", "en-US");
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url.toString(), { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`TMDB fetch failed: ${res.status}`);
  return res.json();
}

// Trending
export const getTrending = (type: "all" | "movie" | "tv", time: "day" | "week" = "day") =>
  fetcher(`/trending/${type}/${time}`);

// Movies
export const getPopularMovies = (page = 1) => fetcher("/movie/popular", { page: String(page) });
export const getNowPlayingMovies = () => fetcher("/movie/now_playing");
export const getTopRatedMovies = () => fetcher("/movie/top_rated");
export const getUpcomingMovies = () => fetcher("/movie/upcoming");
// Discover
export const discoverMovies = (genreId: number, page = 1) =>
  fetcher("/discover/movie", { with_genres: String(genreId), page: String(page), sort_by: "popularity.desc" });
export const discoverTV = (genreId: number, page = 1) =>
  fetcher("/discover/tv", { with_genres: String(genreId), page: String(page), sort_by: "popularity.desc" });
export const getMovieGenres = () => fetcher("/genre/movie/list");
export const getTVGenres = () => fetcher("/genre/tv/list");

// Videos / Trailers
export const getVideos = (type: "movie" | "tv", id: number) =>
  fetcher(`/${type}/${id}/videos`);

// Movie Detail
export const getMovieDetails = (id: number) =>
  fetcher(`/movie/${id}`, { append_to_response: "credits,similar,videos" });

// TV Shows
export const getPopularTV = (page = 1) => fetcher("/tv/popular", { page: String(page) });
export const getTopRatedTV = () => fetcher("/tv/top_rated");
export const getAiringTodayTV = () => fetcher("/tv/airing_today");


// TV Detail
export const getTVDetails = (id: number) =>
  fetcher(`/tv/${id}`, { append_to_response: "credits,similar,videos" });
export const getTVSeason = (id: number, season: number) =>
  fetcher(`/tv/${id}/season/${season}`);

// Search
export const searchMulti = (query: string, page = 1) =>
  fetcher("/search/multi", { query, page: String(page) });
export const searchMovies = (query: string) => fetcher("/search/movie", { query });
export const searchTV = (query: string) => fetcher("/search/tv", { query });

export interface TMDBMedia {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  media_type?: string;
  genre_ids?: number[];
}
