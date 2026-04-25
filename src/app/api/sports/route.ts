import { NextResponse } from "next/server";

const BASE = process.env.NEXT_PUBLIC_SPORTS_API_URL || "https://api.watchfooty.st";

function normalizeUrls(data: any[]): any[] {
  return data.map(m => ({
    ...m,
    poster: m.poster?.startsWith('/') ? `${BASE}${m.poster}` : m.poster,
    leagueLogo: m.leagueLogo?.startsWith('/') ? `${BASE}${m.leagueLogo}` : m.leagueLogo,
    teams: {
      home: m.teams?.home ? { ...m.teams.home, logoUrl: m.teams.home.logoUrl?.startsWith('/') ? `${BASE}${m.teams.home.logoUrl}` : m.teams.home.logoUrl } : m.teams?.home,
      away: m.teams?.away ? { ...m.teams.away, logoUrl: m.teams.away.logoUrl?.startsWith('/') ? `${BASE}${m.teams.away.logoUrl}` : m.teams.away.logoUrl } : m.teams?.away,
    }
  }));
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sport = searchParams.get("sport");
  const type = searchParams.get("type"); // "live" | "popular" | "all"

  let url = "";
  if (type === "live" && sport) {
    url = `${BASE}/api/v1/matches/${sport}/live`;
  } else if (type === "live") {
    url = `${BASE}/api/v1/matches/all/live`;
  } else if (type === "popular" && sport) {
    url = `${BASE}/api/v1/matches/${sport}/popular`;
  } else if (sport) {
    url = `${BASE}/api/v1/matches/${sport}`;
  } else {
    url = `${BASE}/api/v1/matches/all`;
  }

  try {
    const res = await fetch(url, {
      cache: "no-store",
      headers: { "User-Agent": "Mozilla/5.0" }
    });
    if (!res.ok) return NextResponse.json([], { status: 200 });
    const data = await res.json();
    const normalized = Array.isArray(data) ? normalizeUrls(data) : [];
    return NextResponse.json(normalized, {
      headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120" }
    });
  } catch {
    return NextResponse.json([]);
  }
}
