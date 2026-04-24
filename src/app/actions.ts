"use server";
import { discoverMovies, getPopularMovies, discoverTV, getPopularTV } from "@/lib/tmdb";

export async function fetchMoviesAction(page: number, genreId: number | null) {
  if (genreId) return discoverMovies(genreId, page);
  return getPopularMovies(page);
}

export async function fetchTVAction(page: number, genreId: number | null) {
  if (genreId) return discoverTV(genreId, page);
  return getPopularTV(page);
}

import { getPopularAnime } from "@/lib/anilist";

export async function fetchAnimeAction(page: number) {
  return getPopularAnime(page);
}
