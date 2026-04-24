const BASE_URL = process.env.NEXT_PUBLIC_SPORTS_API_URL || "https://api.watchfooty.st";

export interface SportMatch {
  matchId: string;
  title: string;
  poster: string;
  teams: {
    home: { name: string; logoUrl: string; logoId: string };
    away: { name: string; logoUrl: string; logoId: string };
  };
  scores?: { home: number; away: number };
  status: string;
  currentMinute?: string;
  currentMinuteNumber?: number;
  isEvent: boolean;
  date: string;
  timestamp: number;
  league: string;
  leagueLogo: string;
  sport: string;
  streams: {
    id: string;
    url: string;
    quality: string;
    language: string;
    isRedirect: boolean;
    nsfw: boolean;
    ads: boolean;
  }[];
}

export interface SportCategory {
  name: string;
  displayName: string;
}

// Fix relative URLs from the API (e.g. /api/v1/poster/123 -> https://api.watchfooty.st/api/v1/poster/123)
function normalizeMatch(match: SportMatch): SportMatch {
  try {
    const fixUrl = (url: string) => (url && typeof url === 'string' && url.startsWith('/')) ? `${BASE_URL}${url}` : (url || '');
    return {
      ...match,
      poster: fixUrl(match.poster),
      leagueLogo: fixUrl(match.leagueLogo),
      teams: {
        home: match.teams?.home ? { ...match.teams.home, logoUrl: fixUrl(match.teams.home.logoUrl) } : { name: '', logoUrl: '', logoId: '' },
        away: match.teams?.away ? { ...match.teams.away, logoUrl: fixUrl(match.teams.away.logoUrl) } : { name: '', logoUrl: '', logoId: '' },
      },
      streams: match.streams || [],
    };
  } catch {
    return match;
  }
}

export async function getLiveMatches(): Promise<SportMatch[]> {
  try {
    const res = await fetch(`${BASE_URL}/api/v1/matches/all/live`, {
      next: { revalidate: 60 }
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data.map(normalizeMatch) : [];
  } catch (error) {
    console.error("Error fetching live matches:", error);
    return [];
  }
}

export async function getAllMatches(): Promise<SportMatch[]> {
  try {
    const res = await fetch(`${BASE_URL}/api/v1/matches/all`, {
      next: { revalidate: 120 }
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data.map(normalizeMatch) : [];
  } catch (error) {
    console.error("Error fetching all matches:", error);
    return [];
  }
}

export async function getMatchDetails(id: string): Promise<SportMatch | null> {
  try {
    const res = await fetch(`${BASE_URL}/api/v1/match/${id}`, {
      cache: "no-store" // always fresh for live matches
    });
    if (!res.ok) return null;
    const text = await res.text();
    if (!text || text.trim() === '') return null;
    const data = JSON.parse(text);
    // API returns a single object (not array) for match details
    let match: SportMatch | null = null;
    if (Array.isArray(data)) {
      match = data.length > 0 ? data[0] : null;
    } else if (data && typeof data === 'object' && !Array.isArray(data)) {
      match = data as SportMatch;
    }
    if (!match) return null;
    // Inject matchId from URL since detail endpoint doesn't return it
    if (!match.matchId) match = { ...match, matchId: id };
    return normalizeMatch(match);
  } catch (error) {
    console.error("Error fetching match details for id:", id, error);
    return null;
  }
}

export async function getSports(): Promise<SportCategory[]> {
  try {
    const res = await fetch(`${BASE_URL}/api/v1/sports`, {
      next: { revalidate: 86400 } // Cache for a day
    });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("Error fetching sports:", error);
    return [];
  }
}

export async function getMatchesBySport(sport: string): Promise<SportMatch[]> {
  try {
    const res = await fetch(`${BASE_URL}/api/v1/matches/${sport}`, {
      next: { revalidate: 120 }
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data.map(normalizeMatch) : [];
  } catch (error) {
    console.error("Error fetching matches by sport:", error);
    return [];
  }
}
