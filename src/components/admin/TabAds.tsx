"use client";
import { useState, useEffect } from "react";
import { Save, Loader2, CheckCircle, Plus, Trash2, Image as ImageIcon, Video } from "lucide-react";

interface AdItem {
  imageUrl: string;
  linkUrl: string;
}

interface AdsConfig {
  popup: { enabled: boolean; ads: AdItem[]; };
  preRoll: {
    enabled: boolean; type: "image" | "video"; durationSeconds: number;
    videoUrl: string; videoLinkUrl: string; imageAds: AdItem[];
  };
  bannerAds: {
    homeEnabled: boolean; homeAds: AdItem[];
    detailEnabled: boolean; detailAds: AdItem[];
  };
  sportAds: {
    bannerEnabled: boolean; bannerAds: AdItem[];   // 728x90, max 4
    squareEnabled: boolean; squareAds: AdItem[];   // 300x300, max 4
    sidebarEnabled: boolean; sidebarAds: AdItem[];  // 300x300, max 2
  };
}

const DEFAULT_CONFIG: AdsConfig = {
  popup: { enabled: false, ads: [] },
  preRoll: { enabled: false, type: "image", durationSeconds: 5, videoUrl: "", videoLinkUrl: "", imageAds: [] },
  bannerAds: { homeEnabled: false, homeAds: [], detailEnabled: false, detailAds: [] },
  sportAds: { bannerEnabled: false, bannerAds: [], squareEnabled: false, squareAds: [], sidebarEnabled: false, sidebarAds: [] }
};

export default function TabAds() {
  const [config, setConfig] = useState<AdsConfig>(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/ads")
      .then(r => r.json())
      .then(d => {
        setConfig({
          popup: d.popup || DEFAULT_CONFIG.popup,
          preRoll: d.preRoll || DEFAULT_CONFIG.preRoll,
          bannerAds: d.bannerAds || DEFAULT_CONFIG.bannerAds,
          sportAds: d.sportAds || DEFAULT_CONFIG.sportAds
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true);
    await fetch("/api/admin/ads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (loading) return <div className="flex justify-center py-10"><Loader2 className="animate-spin text-zinc-500" /></div>;

  return (
    <div className="max-w-4xl pb-20 space-y-6">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-xl font-bold text-white">Ads Manager V2</h2>
          <p className="text-zinc-500 text-sm mt-1">Atur Popup, Pre-Roll & Banner Ads</p>
        </div>
        <div className="flex items-center gap-3">
          {saved && (
            <span className="text-emerald-500 text-xs font-bold animate-in fade-in slide-in-from-right-2 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              Berhasil Disimpan!
            </span>
          )}
          <button onClick={save} disabled={saving} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-all disabled:opacity-50">
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Simpan Konfigurasi
          </button>
        </div>
      </div>

      {/* ── 1. POPUP ADS ── */}
      <div className="bg-zinc-900 border border-white/5 rounded-2xl p-6">
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/5">
          <div>
            <h3 className="text-white font-bold flex items-center gap-2">1. Popup Ads (Halaman Film)</h3>
            <p className="text-zinc-500 text-xs mt-1">Muncul saat user masuk ke halaman detail film.</p>
          </div>
          <button onClick={() => setConfig({ ...config, popup: { ...config.popup, enabled: !config.popup.enabled } })} className={`w-12 h-6 rounded-full transition-colors relative ${config.popup.enabled ? 'bg-red-600' : 'bg-zinc-700'}`}>
            <div className={`absolute top-1 bottom-1 w-4 bg-white rounded-full transition-all ${config.popup.enabled ? 'left-7' : 'left-1'}`} />
          </button>
        </div>

        {config.popup.enabled && (
          <div className="space-y-4">
            <AdGridEditor
              ads={config.popup.ads}
              max={9}
              columns={3}
              aspectRatio="aspect-square"
              objectFit="object-cover"
              onChange={(newAds) => setConfig({ ...config, popup: { ...config.popup, ads: newAds } })}
            />
          </div>
        )}
      </div>

      {/* ── 2. PRE-ROLL ADS ── */}
      <div className="bg-zinc-900 border border-white/5 rounded-2xl p-6">
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/5">
          <div>
            <h3 className="text-white font-bold flex items-center gap-2">2. Pre-Roll Ads (Dalam Video Player)</h3>
            <p className="text-zinc-500 text-xs mt-1">Iklan yang muncul sebelum film diputar.</p>
          </div>
          <button onClick={() => setConfig({ ...config, preRoll: { ...config.preRoll, enabled: !config.preRoll.enabled } })} className={`w-12 h-6 rounded-full transition-colors relative ${config.preRoll.enabled ? 'bg-red-600' : 'bg-zinc-700'}`}>
            <div className={`absolute top-1 bottom-1 w-4 bg-white rounded-full transition-all ${config.preRoll.enabled ? 'left-7' : 'left-1'}`} />
          </button>
        </div>

        {config.preRoll.enabled && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2 block">Tipe Iklan</label>
                <div className="flex bg-zinc-950 rounded-lg p-1 border border-white/5">
                  <button
                    onClick={() => setConfig({ ...config, preRoll: { ...config.preRoll, type: "image" } })}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-xs font-bold transition-all ${config.preRoll.type === 'image' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                  >
                    <ImageIcon size={14} /> Gambar Grid (3x3)
                  </button>
                  <button
                    onClick={() => setConfig({ ...config, preRoll: { ...config.preRoll, type: "video" } })}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-xs font-bold transition-all ${config.preRoll.type === 'video' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                  >
                    <Video size={14} /> Video (.mp4)
                  </button>
                </div>
              </div>

              <div>
                <label className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2 block">
                  {config.preRoll.type === "image" ? "Durasi Tampil Iklan (Otomatis Tutup)" : "Delay Tombol Skip Muncul"}
                </label>
                <div className="flex items-center gap-3">
                  <input type="number" min="0" max="60" value={config.preRoll.durationSeconds} onChange={e => setConfig({ ...config, preRoll: { ...config.preRoll, durationSeconds: parseInt(e.target.value) || 0 } })} className="w-full bg-zinc-950 border border-white/5 rounded-lg px-4 py-2.5 text-sm text-white" />
                  <span className="text-zinc-500 text-sm">Detik</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5">
              {config.preRoll.type === "image" ? (
                <AdGridEditor
                  ads={config.preRoll.imageAds}
                  max={9}
                  columns={3}
                  aspectRatio="aspect-square"
                  objectFit="object-cover"
                  onChange={(newAds) => setConfig({ ...config, preRoll: { ...config.preRoll, imageAds: newAds } })}
                />
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2 block">Video URL (.mp4 / .webm)</label>
                    <input type="url" value={config.preRoll.videoUrl} onChange={e => setConfig({ ...config, preRoll: { ...config.preRoll, videoUrl: e.target.value } })} placeholder="https://example.com/ad.mp4" className="w-full bg-zinc-950 border border-white/5 rounded-lg px-4 py-2.5 text-sm text-white" />
                  </div>
                  <div>
                    <label className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2 block">Link Tujuan (Saat Video Diklik)</label>
                    <input type="url" value={config.preRoll.videoLinkUrl} onChange={e => setConfig({ ...config, preRoll: { ...config.preRoll, videoLinkUrl: e.target.value } })} placeholder="https://sponsor.com" className="w-full bg-zinc-950 border border-white/5 rounded-lg px-4 py-2.5 text-sm text-white" />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── 3. BANNER ADS ── */}
      <div className="bg-zinc-900 border border-white/5 rounded-2xl p-6">
        <h3 className="text-white font-bold flex items-center gap-2 mb-1">3. Banner Ads (728x90)</h3>
        <p className="text-zinc-500 text-xs mb-5 pb-4 border-b border-white/5">Iklan banner panjang yang diselipkan di halaman.</p>

        <div className="space-y-6">
          {/* Banner Home */}
          <div className="bg-zinc-950/50 p-4 rounded-xl border border-white/5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-white text-sm font-bold">Banner di Halaman Utama</h4>
                <p className="text-zinc-500 text-xs mt-1">Diselipkan di antara baris film. 2 banner sejajar (Maks 6).</p>
              </div>
              <button onClick={() => setConfig({ ...config, bannerAds: { ...config.bannerAds, homeEnabled: !config.bannerAds.homeEnabled } })} className={`w-10 h-5 rounded-full transition-colors relative ${config.bannerAds.homeEnabled ? 'bg-red-600' : 'bg-zinc-700'}`}>
                <div className={`absolute top-1 bottom-1 w-3 bg-white rounded-full transition-all ${config.bannerAds.homeEnabled ? 'left-6' : 'left-1'}`} />
              </button>
            </div>
            {config.bannerAds.homeEnabled && (
              <AdGridEditor
                ads={config.bannerAds.homeAds}
                max={6}
                columns={2}
                aspectRatio="aspect-[8/1] sm:aspect-[728/90]"
                objectFit="object-contain"
                onChange={(newAds) => setConfig({ ...config, bannerAds: { ...config.bannerAds, homeAds: newAds } })}
              />
            )}
          </div>

          {/* Banner Detail */}
          <div className="bg-zinc-950/50 p-4 rounded-xl border border-white/5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-white text-sm font-bold">Banner di Halaman Detail dan Atas Player Sports</h4>
                <p className="text-zinc-500 text-xs mt-1">Grid 2x2 (Maks 4 banner) di bawah poster sebelum play dan Diatas Player Sports.</p>
              </div>
              <button onClick={() => setConfig({ ...config, bannerAds: { ...config.bannerAds, detailEnabled: !config.bannerAds.detailEnabled } })} className={`w-10 h-5 rounded-full transition-colors relative ${config.bannerAds.detailEnabled ? 'bg-red-600' : 'bg-zinc-700'}`}>
                <div className={`absolute top-1 bottom-1 w-3 bg-white rounded-full transition-all ${config.bannerAds.detailEnabled ? 'left-6' : 'left-1'}`} />
              </button>
            </div>
            {config.bannerAds.detailEnabled && (
              <AdGridEditor
                ads={config.bannerAds.detailAds}
                max={4}
                columns={2}
                aspectRatio="aspect-[8/1] sm:aspect-[728/90]"
                objectFit="object-contain"
                onChange={(newAds) => setConfig({ ...config, bannerAds: { ...config.bannerAds, detailAds: newAds } })}
              />
            )}
          </div>
        </div>
      </div>

      {/* ── 4. SPORT ADS ── */}
      <div className="bg-zinc-900 border border-white/5 rounded-2xl p-6">
        <h3 className="text-white font-bold flex items-center gap-2 mb-1">4. Sport Ads (Halaman Live Match)</h3>
        <p className="text-zinc-500 text-xs mb-5 pb-4 border-b border-white/5">
          Iklan khusus halaman streaming olahraga. Terpisah dari iklan film/anime.
        </p>

        <div className="space-y-6">
          {/* 4a. Banner 728x90 — max 4 */}
          <div className="bg-zinc-950/50 p-4 rounded-xl border border-white/5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="text-white text-sm font-bold">4a. Banner 728×90 (Atas &amp; Bawah Player)</h4>
                <p className="text-zinc-500 text-xs mt-1">Slot 1–2 tampil di atas grid kotak · Slot 3–4 tampil di bawahnya · Maks 4.</p>
              </div>
              <button
                onClick={() => setConfig({ ...config, sportAds: { ...config.sportAds, bannerEnabled: !config.sportAds.bannerEnabled } })}
                className={`w-10 h-5 rounded-full transition-colors relative ${config.sportAds.bannerEnabled ? 'bg-red-600' : 'bg-zinc-700'}`}
              >
                <div className={`absolute top-1 bottom-1 w-3 bg-white rounded-full transition-all ${config.sportAds.bannerEnabled ? 'left-6' : 'left-1'}`} />
              </button>
            </div>
            {config.sportAds.bannerEnabled && (
              <AdGridEditor
                ads={config.sportAds.bannerAds}
                max={4}
                columns={1}
                aspectRatio="aspect-[728/90]"
                objectFit="object-contain"
                onChange={(newAds) => setConfig({ ...config, sportAds: { ...config.sportAds, bannerAds: newAds } })}
              />
            )}
          </div>

          {/* 4b. Square 300x300 — max 4, 2×2 */}
          <div className="bg-zinc-950/50 p-4 rounded-xl border border-white/5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="text-white text-sm font-bold">4b. Kotak 300×300 (Grid 2×2 di antara Banner)</h4>
                <p className="text-zinc-500 text-xs mt-1">4 slot kotak di antara banner atas &amp; bawah · Maks 4.</p>
              </div>
              <button
                onClick={() => setConfig({ ...config, sportAds: { ...config.sportAds, squareEnabled: !config.sportAds.squareEnabled } })}
                className={`w-10 h-5 rounded-full transition-colors relative ${config.sportAds.squareEnabled ? 'bg-red-600' : 'bg-zinc-700'}`}
              >
                <div className={`absolute top-1 bottom-1 w-3 bg-white rounded-full transition-all ${config.sportAds.squareEnabled ? 'left-6' : 'left-1'}`} />
              </button>
            </div>
            {config.sportAds.squareEnabled && (
              <AdGridEditor
                ads={config.sportAds.squareAds}
                max={4}
                columns={2}
                aspectRatio="aspect-square"
                objectFit="object-contain"
                onChange={(newAds) => setConfig({ ...config, sportAds: { ...config.sportAds, squareAds: newAds } })}
              />
            )}
          </div>

          {/* 4c. Sidebar 300x300 — max 2 */}
          <div className="bg-zinc-950/50 p-4 rounded-xl border border-white/5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="text-white text-sm font-bold">4c. Sidebar 300×300 (Bawah Info Match)</h4>
                <p className="text-zinc-500 text-xs mt-1">2 slot kotak di sidebar kanan, di bawah detail pertandingan · Maks 2.</p>
              </div>
              <button
                onClick={() => setConfig({ ...config, sportAds: { ...config.sportAds, sidebarEnabled: !config.sportAds.sidebarEnabled } })}
                className={`w-10 h-5 rounded-full transition-colors relative ${config.sportAds.sidebarEnabled ? 'bg-red-600' : 'bg-zinc-700'}`}
              >
                <div className={`absolute top-1 bottom-1 w-3 bg-white rounded-full transition-all ${config.sportAds.sidebarEnabled ? 'left-6' : 'left-1'}`} />
              </button>
            </div>
            {config.sportAds.sidebarEnabled && (
              <AdGridEditor
                ads={config.sportAds.sidebarAds}
                max={2}
                columns={2}
                aspectRatio="aspect-square"
                objectFit="object-contain"
                onChange={(newAds) => setConfig({ ...config, sportAds: { ...config.sportAds, sidebarAds: newAds } })}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── KOMPONEN BANTUAN UNTUK EDITOR GRID IKLAN ──
function AdGridEditor({ ads, max, columns = 2, aspectRatio = "aspect-square", objectFit = "object-cover", onChange }: { ads: AdItem[], max: number, columns?: number, aspectRatio?: string, objectFit?: string, onChange: (ads: AdItem[]) => void }) {
  const addAd = () => {
    if (ads.length >= max) return;
    onChange([...ads, { imageUrl: "", linkUrl: "" }]);
  };

  const removeAd = (idx: number) => {
    onChange(ads.filter((_, i) => i !== idx));
  };

  const updateAd = (idx: number, field: keyof AdItem, val: string) => {
    const next = [...ads];
    next[idx] = { ...next[idx], [field]: val };
    onChange(next);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Slot Iklan (Maks {max}, Aktif: {ads.length})</label>
        <button onClick={addAd} disabled={ads.length >= max} className="flex items-center gap-1 bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all disabled:opacity-50">
          <Plus size={14} /> Tambah Kotak
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Kolom Editor */}
        <div className="space-y-3">
          {ads.length === 0 ? (
            <div className="bg-zinc-950 border border-white/5 rounded-xl p-8 text-center text-zinc-500 text-sm">Belum ada iklan. Klik tombol "Tambah Kotak".</div>
          ) : (
            ads.map((ad, idx) => (
              <div key={idx} className="bg-zinc-950 border border-white/5 rounded-xl p-4 flex gap-3 relative group">
                <div className="w-16 h-16 bg-zinc-900 rounded overflow-hidden flex-shrink-0 border border-white/10">
                  {ad.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={ad.imageUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-700"><ImageIcon size={20} /></div>
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <input type="url" value={ad.imageUrl} onChange={e => updateAd(idx, "imageUrl", e.target.value)} placeholder="Image URL" className="w-full bg-zinc-900 border border-white/5 rounded px-3 py-1.5 text-xs text-white" />
                  <input type="url" value={ad.linkUrl} onChange={e => updateAd(idx, "linkUrl", e.target.value)} placeholder="Redirect Link URL" className="w-full bg-zinc-900 border border-white/5 rounded px-3 py-1.5 text-xs text-white" />
                </div>
                <button onClick={() => removeAd(idx)} className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center shadow-lg transition-all hover:scale-110">
                  <Trash2 size={12} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Kolom Preview */}
        <div className="bg-zinc-950 border border-white/5 rounded-xl p-4 flex items-center justify-center min-h-[300px]">
          {ads.length > 0 ? (
            <div className="grid gap-2 p-2 bg-black rounded border border-white/10 w-full" style={{
              gridTemplateColumns: `repeat(${Math.min(columns, ads.length || 1)}, minmax(0, 1fr))`
            }}>
              {ads.map((ad, idx) => (
                <div key={idx} className={`w-full ${aspectRatio} bg-black rounded border border-white/10 overflow-hidden`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={ad.imageUrl || undefined} alt="" className={`w-full h-full ${objectFit}`} />
                </div>
              ))}
            </div>
          ) : (
            <span className="text-zinc-600 text-sm font-bold uppercase tracking-widest">Live Preview Area</span>
          )}
        </div>
      </div>
    </div>
  );
}
