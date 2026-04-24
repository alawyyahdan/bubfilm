import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

async function checkService(name: string, url: string, options?: RequestInit) {
  try {
    const start = Date.now();
    const res = await fetch(url, {
      ...options,
      signal: AbortSignal.timeout(6000),
      // Use no-store to bypass cache
      cache: "no-store",
    });
    const ms = Date.now() - start;
    let status: "ok" | "warning" | "error" = "ok";
    if (res.status >= 400) {
      status = "warning";
    }
    return { name, status, ms, code: res.status };
  } catch {
    return { name, status: "error" as const, ms: null, code: null };
  }
}

export async function GET(req: Request) {
  const cookie = req.headers.get("cookie") || "";
  if (!cookie.includes("admin_session=valid")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Load dynamic providers
  let providers: any[] = [];
  try {
    const raw = fs.readFileSync(path.join(process.cwd(), "data", "providers-config.json"), "utf-8");
    providers = JSON.parse(raw).filter((p: any) => p.enabled);
  } catch {}

  const providerChecks = providers.map(p => {
    // Extract base URL from movieUrl (e.g. https://vidlink.pro/movie/{tmdb} -> https://vidlink.pro)
    let baseUrl = "";
    try {
      const url = new URL(p.movieUrl || p.tvUrl || p.animeUrl);
      baseUrl = url.origin;
    } catch {
      baseUrl = p.movieUrl || p.tvUrl || p.animeUrl;
    }
    return checkService(p.name, baseUrl, { method: "GET" });
  });

  const results = await Promise.all([
    // TMDB: real API call
    checkService("TMDB API",
      `${process.env.NEXT_PUBLIC_TMDB_BASE_URL}/configuration?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
    ),
    // AniList: POST GraphQL ping
    checkService("AniList GraphQL", "https://graphql.anilist.co", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: "{ Page(page:1,perPage:1){ media{ id } } }" }),
    }),
    // WatchFooty Sports API
    checkService("WatchFooty API", `${process.env.NEXT_PUBLIC_SPORTS_API_URL || "https://api.watchfooty.st"}/api/v1/sports`),
    ...providerChecks
  ]);

  return NextResponse.json({ services: results, timestamp: new Date().toISOString() });
}
