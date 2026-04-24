import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const FILE = path.join(process.cwd(), "data", "analytics.json");

function readAnalytics() {
  try {
    return JSON.parse(fs.readFileSync(FILE, "utf-8"));
  } catch {
    return { totalPageViews: 0, uniqueSessions: 0, pages: {}, dailyViews: {}, lastUpdated: "" };
  }
}

// POST /api/analytics/track — called by client on each page load
export async function POST(req: Request) {
  try {
    const { page } = await req.json();
    const data = readAnalytics();
    const today = new Date().toISOString().slice(0, 10);

    data.totalPageViews = (data.totalPageViews || 0) + 1;
    data.pages[page] = (data.pages[page] || 0) + 1;
    data.dailyViews[today] = (data.dailyViews[today] || 0) + 1;
    data.lastUpdated = new Date().toISOString();

    fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

// GET /api/analytics/track — admin reads analytics
export async function GET(req: Request) {
  const cookie = req.headers.get("cookie") || "";
  if (!cookie.includes("admin_session=valid")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(readAnalytics());
}
