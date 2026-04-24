import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const src = url.searchParams.get("src");
  if (!src) return new NextResponse("Missing src", { status: 400 });

  // Only allow proxying from watchfooty domain
  if (!src.startsWith("https://api.watchfooty.st")) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  try {
    const res = await fetch(src, {
      headers: { "User-Agent": "Mozilla/5.0" },
      next: { revalidate: 86400 } // Cache logos for 1 day
    });
    if (!res.ok) return new NextResponse("Upstream error", { status: res.status });

    const contentType = res.headers.get("content-type") || "image/png";
    const buffer = await res.arrayBuffer();

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch {
    return new NextResponse("Proxy error", { status: 500 });
  }
}
