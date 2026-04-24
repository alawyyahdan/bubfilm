"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Activity, Image as ImageIcon, Settings, LogOut, Server,
  Globe, BarChart2, ChevronRight, Tv, Play
} from "lucide-react";
import TabHealth from "./TabHealth";
import TabAnalytics from "./TabAnalytics";
import TabProviders from "./TabProviders";
import TabAds from "./TabAds";
import TabSite from "./TabSite";

const TABS = [
  { id: "analytics", label: "Analytics", icon: BarChart2 },
  { id: "health", label: "API Health", icon: Activity },
  { id: "providers", label: "Providers", icon: Play },
  { id: "ads", label: "Ads Manager", icon: ImageIcon },
  { id: "site", label: "Site Settings", icon: Globe },
  { id: "settings", label: "Settings", icon: Settings },
] as const;
type Tab = typeof TABS[number]["id"];

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("analytics");
  const [loggingOut, setLoggingOut] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = useCallback(async () => {
    setLoggingOut(true);
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/ketua");
  }, [router]);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col">
      {/* TOP BAR */}
      <header className="h-14 bg-zinc-900/80 backdrop-blur border-b border-white/5 px-4 flex items-center justify-between sticky top-0 z-50 shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="sm:hidden p-1.5 text-zinc-400 hover:text-white">
            <Server size={18} />
          </button>
          <div className="flex items-center gap-2">
            <div className="bg-red-600 p-1.5 rounded-lg">
              <Tv size={16} className="text-white" />
            </div>
            <span className="font-black text-sm text-white">Admin <span className="text-red-500">Panel</span></span>
          </div>
          <ChevronRight size={13} className="text-zinc-700" />
          <span className="text-zinc-500 text-xs">{TABS.find(t => t.id === activeTab)?.label}</span>
        </div>
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="flex items-center gap-1.5 text-zinc-500 hover:text-red-400 transition-colors text-xs font-medium"
        >
          <LogOut size={14} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR */}
        <aside className={`${sidebarOpen ? "flex" : "hidden"} sm:flex flex-col w-14 sm:w-52 bg-zinc-900/50 border-r border-white/5 pt-2 shrink-0`}>
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => { setActiveTab(id); setSidebarOpen(false); }}
              className={`flex items-center gap-3 px-3 sm:px-4 py-3 text-xs sm:text-sm font-medium transition-all text-left relative ${
                activeTab === id
                  ? "text-white bg-white/5 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-0.5 before:bg-red-500"
                  : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
              }`}
            >
              <Icon size={16} className={`shrink-0 ${activeTab === id ? "text-red-500" : ""}`} />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {activeTab === "analytics" && <TabAnalytics />}
          {activeTab === "health" && <TabHealth />}
          {activeTab === "providers" && <TabProviders />}
          {activeTab === "ads" && <TabAds />}
          {activeTab === "site" && <TabSite />}
          {activeTab === "settings" && <TabSettings />}
        </main>
      </div>
    </div>
  );
}

function TabSettings() {
  return (
    <div className="max-w-2xl">
      <h2 className="text-base font-bold text-white mb-1">Settings</h2>
      <p className="text-zinc-500 text-xs mb-6">API keys harus diganti langsung di file <code className="bg-zinc-800 px-1 rounded">.env.local</code> lalu restart server.</p>
      <div className="bg-zinc-900 border border-white/5 rounded-xl p-5 space-y-3">
        {[
          ["TMDB API Key", process.env.NEXT_PUBLIC_TMDB_API_KEY || ""],
          ["TMDB Base URL", process.env.NEXT_PUBLIC_TMDB_BASE_URL || ""],
          ["Videasy Base", process.env.NEXT_PUBLIC_VIDEASY_BASE || ""],
        ].map(([label, val]) => (
          <div key={label}>
            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider mb-1">{label}</p>
            <div className="bg-zinc-950 rounded-lg px-3 py-2 font-mono text-xs text-zinc-300 break-all">{val || <span className="text-zinc-600">Not set</span>}</div>
          </div>
        ))}
        <div className="pt-3 border-t border-white/5">
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg px-4 py-3 text-amber-400 text-xs">
            ⚠️ Ubah nilai di <code>.env.local</code> lalu jalankan ulang <code>npm run dev</code> atau restart PM2.
          </div>
        </div>
      </div>
    </div>
  );
}
