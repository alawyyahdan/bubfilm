// AniList GraphQL Client
const ANILIST_URL = "https://graphql.anilist.co";

async function anilistFetch(query: string, variables: Record<string, unknown> = {}) {
  const res = await fetch(ANILIST_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 3600 },
  });
  const json = await res.json();
  return json.data;
}

const MEDIA_FIELDS = `
  id
  idMal
  title { romaji english native }
  coverImage { large extraLarge }
  bannerImage
  description(asHtml: false)
  averageScore
  popularity
  episodes
  duration
  status
  season
  seasonYear
  format
  genres
  isAdult
  trailer { id site }
`;

export const getTrendingAnime = () =>
  anilistFetch(`query {
    Page(page: 1, perPage: 20) {
      media(sort: TRENDING_DESC, type: ANIME, isAdult: false) { ${MEDIA_FIELDS} }
    }
  }`).then((d) => d.Page.media);

export const getPopularAnime = (page = 1) =>
  anilistFetch(`query($page: Int) {
    Page(page: $page, perPage: 20) {
      media(sort: POPULARITY_DESC, type: ANIME, isAdult: false) { ${MEDIA_FIELDS} }
    }
  }`, { page }).then((d) => d.Page.media);

export const getSeasonalAnime = (season: string, year: number) =>
  anilistFetch(`query($season: MediaSeason, $year: Int) {
    Page(page: 1, perPage: 20) {
      media(season: $season, seasonYear: $year, sort: POPULARITY_DESC, type: ANIME, isAdult: false) { ${MEDIA_FIELDS} }
    }
  }`, { season, year }).then((d) => d.Page.media);

export const getTopRatedAnime = () =>
  anilistFetch(`query {
    Page(page: 1, perPage: 20) {
      media(sort: SCORE_DESC, type: ANIME, isAdult: false) { ${MEDIA_FIELDS} }
    }
  }`).then((d) => d.Page.media);

export const getAnimeDetails = (id: number) =>
  anilistFetch(`query($id: Int) {
    Media(id: $id, type: ANIME) {
      ${MEDIA_FIELDS}
      characters(role: MAIN, page: 1, perPage: 10) {
        nodes {
          id
          name { full }
          image { large }
        }
      }
      relations {
        nodes { id title { romaji } coverImage { large } format }
      }
      recommendations(page: 1, perPage: 14) {
        nodes {
          mediaRecommendation {
            id title { romaji } coverImage { large } format averageScore seasonYear
          }
        }
      }
    }
  }`, { id }).then((d) => d.Media);

export const searchAnime = (search: string) =>
  anilistFetch(`query($search: String) {
    Page(page: 1, perPage: 20) {
      media(search: $search, type: ANIME, isAdult: false) { ${MEDIA_FIELDS} }
    }
  }`, { search }).then((d) => d.Page.media);

export interface AniListMedia {
  id: number;
  idMal: number | null;
  title: { romaji: string; english: string | null; native: string };
  coverImage: { large: string; extraLarge: string };
  bannerImage: string | null;
  description: string | null;
  averageScore: number | null;
  popularity: number;
  episodes: number | null;
  duration: number | null;
  status: string;
  season: string | null;
  seasonYear: number | null;
  format: string;
  genres: string[];
  isAdult: boolean;
  trailer?: { id: string; site: string } | null;
}
