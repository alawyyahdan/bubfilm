import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

const ADS_FILE = path.join(process.cwd(), "data", "ads-config.json");

export async function GET() {
  try {
    const raw = fs.readFileSync(ADS_FILE, "utf-8");
    return NextResponse.json(JSON.parse(raw));
  } catch {
    return NextResponse.json({
      popup: { enabled: false, ads: [] },
      preRoll: { enabled: false, type: "image", durationSeconds: 5, videoUrl: "", videoLinkUrl: "", imageAds: [] },
      bannerAds: { homeEnabled: false, homeAds: [], detailEnabled: false, detailAds: [] },
      sportAds: {
        bannerEnabled: false, bannerAds: [],
        squareEnabled: false, squareAds: [],
        sidebarEnabled: false, sidebarAds: []
      }
    });
  }
}

export async function POST(req: Request) {
  // Verify admin session
  const cookie = req.headers.get("cookie") || "";
  if (!cookie.includes("admin_session=valid")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    fs.writeFileSync(ADS_FILE, JSON.stringify(body, null, 2));
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
