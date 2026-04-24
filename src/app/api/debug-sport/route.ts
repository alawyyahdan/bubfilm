import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id") || "23_O0aclgPG";
  const BASE = "https://api.watchfooty.st";
  
  try {
    const res = await fetch(`${BASE}/api/v1/match/${id}`, { cache: "no-store" });
    const text = await res.text();
    return NextResponse.json({ 
      status: res.status, 
      id, 
      preview: text.slice(0, 300),
      isArray: text.trim().startsWith("["),
      isObject: text.trim().startsWith("{")
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message, id });
  }
}
