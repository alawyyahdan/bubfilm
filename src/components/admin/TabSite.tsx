"use client";
import { useState, useEffect } from "react";
import { Save, Loader2, CheckCircle, Image as ImageIcon, Type } from "lucide-react";

interface SiteConfig {
  siteName: string;
  siteTitle: string;
  siteDescription: string;
  siteKeywords: string;
  logoType: "text" | "image";
  logoText: string;
  logoImageUrl: string;
  faviconUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImageUrl: string;
  siteUrl: string;
  dmcaHtml: string;
  advertiseEmail: string;
  chatangoId: string;
  chatangoHandle: string;
  enableAdBlocker?: boolean;
}

export default function TabSite() {
  const [config, setConfig] = useState<SiteConfig>({
    siteName: "WebStreaming",
    siteTitle: "WebStreaming - Watch Movies, TV Shows & Anime Free",
    siteDescription: "Stream thousands of movies, TV shows, and anime for free on WebStreaming.",
    siteKeywords: "streaming, movies, tv shows, anime, free",
    logoType: "text",
    logoText: "WebStreaming",
    logoImageUrl: "",
    faviconUrl: "",
    siteUrl: "",
    ogTitle: "WebStreaming - Watch Free Online",
    ogDescription: "Stream movies, TV shows & anime for free",
    ogImageUrl: "",
    enableAdBlocker: true,
    dmcaHtml: `<div class="space-y-8 text-zinc-300">
  <section>
    <h3 class="text-xl font-bold text-white mb-2">Overview</h3>
    <p class="leading-relaxed text-sm">
      We are a search and indexing service that provides links to content hosted on external, third-party servers. We do not upload, host, store, or distribute any video files, media content, or copyrighted material on our own servers. All streams and downloads accessible through our site originate from sources that are not owned, operated, or controlled by us.
    </p>
  </section>

  <section>
    <h3 class="text-xl font-bold text-white mb-2">Our Role</h3>
    <p class="leading-relaxed text-sm">
      We function similarly to a search engine. We aggregate publicly available links from around the internet and present them in an organized format. We have no control over the nature, content, or availability of the material found on these third-party sites. If copyrighted content appears through our indexing, the responsibility lies with the third-party host, not with us.
    </p>
  </section>

  <section>
    <h3 class="text-xl font-bold text-white mb-2">Contact</h3>
    <p class="leading-relaxed text-sm mb-4">
      Send all DMCA takedown notices and copyright-related inquiries to:
    </p>
    <a href="mailto:hello@larp.pw" class="text-red-500 hover:text-red-400 font-bold border-b border-red-500">hello@larp.pw</a>
  </section>

  <section>
    <h3 class="text-xl font-bold text-white mb-2">Disclaimer</h3>
    <p class="leading-relaxed text-sm">
      The service is provided on an "as is" basis. We make no guarantees regarding the accuracy, legality, or availability of any third-party content that may be accessed through our service. Users are solely responsible for ensuring that their use of any content complies with all applicable local, national, and international laws. By using our site, you acknowledge and agree that we bear no liability for any content accessed through third-party links indexed by our platform.
    </p>
  </section>
</div>`,
    advertiseEmail: "",
    chatangoId: "cid0020000437940472083",
    chatangoHandle: "bububfilm",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/site")
      .then(r => r.json())
      .then(d => {
        if (Object.keys(d).length > 0) {
          // Merge API response but keep default dmcaHtml if it's missing
          setConfig(prev => ({
            ...prev,
            ...d,
            dmcaHtml: d.dmcaHtml || prev.dmcaHtml
          }));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true);
    await fetch("/api/admin/site", {
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
    <div className="max-w-3xl pb-20">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-base font-bold text-white">Site Settings</h2>
          <p className="text-zinc-500 text-xs mt-0.5">Atur nama, logo, favicon, dan metadata SEO</p>
        </div>
        <div className="flex items-center gap-3">
          {saved && (
            <span className="text-emerald-500 text-xs font-bold animate-in fade-in slide-in-from-right-2 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              Berhasil Disimpan!
            </span>
          )}
          <button onClick={save} disabled={saving} className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50">
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            Simpan Semua
          </button>
        </div>
      </div>

      <div className="space-y-6">
        
        {/* Branding */}
        <div className="bg-zinc-900 border border-white/5 rounded-xl p-5">
          <h3 className="text-sm font-bold text-white border-b border-white/5 pb-3 mb-4">Branding & Logo</h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider mb-2 block">Tipe Logo Navigation Bar</label>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfig({...config, logoType: "text"})}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-xs font-semibold transition-all ${config.logoType === 'text' ? 'bg-red-600/10 border-red-500 text-red-500' : 'bg-zinc-950 border-white/5 text-zinc-500 hover:text-white'}`}
                >
                  <Type size={14} /> Text Logo
                </button>
                <button
                  onClick={() => setConfig({...config, logoType: "image"})}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-xs font-semibold transition-all ${config.logoType === 'image' ? 'bg-red-600/10 border-red-500 text-red-500' : 'bg-zinc-950 border-white/5 text-zinc-500 hover:text-white'}`}
                >
                  <ImageIcon size={14} /> Image Logo
                </button>
              </div>
            </div>

            {config.logoType === "text" ? (
              <div>
                <label className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider mb-1 block">Teks Logo</label>
                <input type="text" value={config.logoText} onChange={e => setConfig({...config, logoText: e.target.value})} className="w-full bg-zinc-950 border border-white/5 rounded-lg px-3 py-2 text-xs text-white" />
                <p className="text-zinc-600 text-[10px] mt-1">Gunakan format "Nama" atau biarkan kosong jika ingin default.</p>
              </div>
            ) : (
              <div>
                <label className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider mb-1 block">URL Gambar Logo</label>
                <input type="url" value={config.logoImageUrl} onChange={e => setConfig({...config, logoImageUrl: e.target.value})} placeholder="https://example.com/logo.png" className="w-full bg-zinc-950 border border-white/5 rounded-lg px-3 py-2 text-xs text-white" />
                <p className="text-zinc-600 text-[10px] mt-1">Disarankan gambar PNG transparan, tinggi ideal 30-40px.</p>
              </div>
            )}

            <div>
              <label className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider mb-1 block">URL Favicon (.ico / .png)</label>
              <input type="url" value={config.faviconUrl} onChange={e => setConfig({...config, faviconUrl: e.target.value})} placeholder="https://example.com/favicon.ico" className="w-full bg-zinc-950 border border-white/5 rounded-lg px-3 py-2 text-xs text-white" />
              {config.faviconUrl && (
                <div className="mt-2 flex items-center gap-3">
                  <span className="text-zinc-600 text-[10px]">Preview:</span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={config.faviconUrl || undefined} alt="favicon" className="w-8 h-8 rounded bg-white/5 object-contain" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* SEO */}
        <div className="bg-zinc-900 border border-white/5 rounded-xl p-5">
          <h3 className="text-sm font-bold text-white border-b border-white/5 pb-3 mb-4">SEO & Metadata</h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider mb-1 block">Nama Situs Utama</label>
              <input type="text" value={config.siteName} onChange={e => setConfig({...config, siteName: e.target.value})} className="w-full bg-zinc-950 border border-white/5 rounded-lg px-3 py-2 text-xs text-white" />
            </div>

            <div>
              <label className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider mb-1 block">URL Web Situs (ex: https://bububfilm.com)</label>
              <input type="url" value={config.siteUrl || ""} onChange={e => setConfig({...config, siteUrl: e.target.value})} placeholder="https://domainanda.com" className="w-full bg-zinc-950 border border-white/5 rounded-lg px-3 py-2 text-xs text-white" />
              <p className="text-zinc-600 text-[10px] mt-1">Sangat penting untuk SEO (Google Sitelinks) dan share sosmed.</p>
            </div>

            <div>
              <label className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider mb-1 block">Judul Halaman (Browser Tab)</label>
              <input type="text" value={config.siteTitle} onChange={e => setConfig({...config, siteTitle: e.target.value})} className="w-full bg-zinc-950 border border-white/5 rounded-lg px-3 py-2 text-xs text-white" />
            </div>

            <div>
              <label className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider mb-1 block">Deskripsi SEO (Meta Description)</label>
              <textarea value={config.siteDescription} onChange={e => setConfig({...config, siteDescription: e.target.value})} rows={3} className="w-full bg-zinc-950 border border-white/5 rounded-lg px-3 py-2 text-xs text-white resize-none" />
            </div>

            <div>
              <label className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider mb-1 block">OG Title (Judul saat di-share)</label>
              <input type="text" value={config.ogTitle} onChange={e => setConfig({...config, ogTitle: e.target.value})} className="w-full bg-zinc-950 border border-white/5 rounded-lg px-3 py-2 text-xs text-white" />
            </div>

            <div>
              <label className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider mb-1 block">OG Description (Deskripsi saat di-share)</label>
              <textarea value={config.ogDescription} onChange={e => setConfig({...config, ogDescription: e.target.value})} rows={2} className="w-full bg-zinc-950 border border-white/5 rounded-lg px-3 py-2 text-xs text-white resize-none" />
            </div>

            <div>
              <label className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider mb-1 block">OG Image URL (Thumbnail Sosmed/WA)</label>
              <input type="url" value={config.ogImageUrl || ""} onChange={e => setConfig({...config, ogImageUrl: e.target.value})} placeholder="https://example.com/thumbnail.png" className="w-full bg-zinc-950 border border-white/5 rounded-lg px-3 py-2 text-xs text-white" />
              <p className="text-zinc-600 text-[10px] mt-1">Gambar yang muncul pas link web lu di-share ke WhatsApp, FB, dll. Ukuran ideal 1200x630px.</p>
              {config.ogImageUrl && (
                <div className="mt-2 flex items-center gap-3">
                  <span className="text-zinc-600 text-[10px]">Preview:</span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={config.ogImageUrl || undefined} alt="og-preview" className="w-20 h-auto rounded border border-white/10" />
                </div>
              )}
            </div>

            <div>
              <label className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider mb-1 block">Keywords (pisahkan dengan koma)</label>
              <input type="text" value={config.siteKeywords} onChange={e => setConfig({...config, siteKeywords: e.target.value})} className="w-full bg-zinc-950 border border-white/5 rounded-lg px-3 py-2 text-xs text-white" />
            </div>
          </div>
        </div>

        {/* Legal / DMCA */}
        <div className="bg-zinc-900 border border-white/5 rounded-xl p-5">
          <h3 className="text-sm font-bold text-white border-b border-white/5 pb-3 mb-4">Legal & DMCA</h3>
          <div>
            <label className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider mb-1 block">Konten Halaman DMCA (HTML Raw)</label>
            <textarea 
              value={config.dmcaHtml || ""} 
              onChange={e => setConfig({...config, dmcaHtml: e.target.value})} 
              rows={12} 
              className="w-full bg-zinc-950 font-mono border border-white/5 rounded-lg px-3 py-2 text-xs text-zinc-300 resize-y" 
            />
            <p className="text-zinc-600 text-[10px] mt-1">Gunakan tag HTML untuk memformat halaman DMCA (/dmca). Bebas diedit sesuai kebutuhan.</p>
          </div>
        </div>

        {/* Security & Features */}
        <div className="bg-zinc-900 border border-white/5 rounded-xl p-5">
          <h3 className="text-sm font-bold text-white border-b border-white/5 pb-3 mb-4">Security & Features</h3>
          
          <div className="flex items-center justify-between bg-zinc-950 border border-white/5 p-4 rounded-lg">
            <div>
              <div className="text-xs font-bold text-white mb-1">AdBlock Detector</div>
              <div className="text-[10px] text-zinc-500">Enable or disable the anti-adblock overlay.</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={config.enableAdBlocker !== false} onChange={e => setConfig({...config, enableAdBlocker: e.target.checked})} className="sr-only peer" />
              <div className="w-9 h-5 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-red-600"></div>
            </label>
          </div>
        </div>

        {/* Contact / Advertising */}
        <div className="bg-zinc-900 border border-white/5 rounded-xl p-5">
          <h3 className="text-sm font-bold text-white border-b border-white/5 pb-3 mb-4">Kontak & Advertising</h3>
          <div>
            <label className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider mb-1 block">Email Advertising (Tampil di Footer Tooltip)</label>
            <input
              type="email"
              value={config.advertiseEmail || ""}
              onChange={e => setConfig({...config, advertiseEmail: e.target.value})}
              placeholder="ads@yourdomain.com"
              className="w-full bg-zinc-950 border border-white/5 rounded-lg px-3 py-2 text-xs text-white"
            />
            <p className="text-zinc-600 text-[10px] mt-1">Jika diisi, link &quot;Advertising&quot; akan muncul di footer. Hover akan tampilkan email ini.</p>
          </div>
        </div>

        {/* Chatango Configuration */}
        <div className="bg-zinc-900 border border-white/5 rounded-xl p-5">
          <h3 className="text-sm font-bold text-white border-b border-white/5 pb-3 mb-4">Chatango (Live Chat Sport)</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider mb-1 block">Chatango ID (cid...)</label>
              <input
                type="text"
                value={config.chatangoId || ""}
                onChange={e => setConfig({...config, chatangoId: e.target.value})}
                placeholder="cid0020000437940472083"
                className="w-full bg-zinc-950 border border-white/5 rounded-lg px-3 py-2 text-xs text-white"
              />
            </div>
            <div>
              <label className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider mb-1 block">Chatango Handle</label>
              <input
                type="text"
                value={config.chatangoHandle || ""}
                onChange={e => setConfig({...config, chatangoHandle: e.target.value})}
                placeholder="bububfilm"
                className="w-full bg-zinc-950 border border-white/5 rounded-lg px-3 py-2 text-xs text-white"
              />
            </div>
          </div>
          <p className="text-zinc-600 text-[10px] mt-3">ID dan Handle ini digunakan untuk widget Live Chat di halaman detail pertandingan sport.</p>
        </div>

      </div>
    </div>
  );
}
