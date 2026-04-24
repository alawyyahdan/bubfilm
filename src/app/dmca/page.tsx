import { Metadata } from "next";
import { getSiteConfig } from "@/app/api/admin/site/route";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const config = getSiteConfig();
  return {
    title: `DMCA Policy - ${config.siteName || "WebStreaming"}`,
    description: `DMCA and Copyright Policy for ${config.siteName || "WebStreaming"}.`,
  };
}

export default function DMCAPage() {
  const config = getSiteConfig();

  const dmcaHtml = config.dmcaHtml || `
    <div class="space-y-8 text-zinc-300">
      <section>
        <h3 class="text-xl font-bold text-white mb-2">Overview</h3>
        <p class="leading-relaxed text-sm">
          ${config.siteName || "WebStreaming"} is a search and indexing service that provides links to content hosted on external, third-party servers. We do not upload, host, store, or distribute any video files, media content, or copyrighted material on our own servers. All streams and downloads accessible through ${config.siteName || "WebStreaming"} originate from sources that are not owned, operated, or controlled by us.
        </p>
      </section>

      <section>
        <h3 class="text-xl font-bold text-white mb-2">Our Role</h3>
        <p class="leading-relaxed text-sm">
          ${config.siteName || "WebStreaming"} functions similarly to a search engine. We aggregate publicly available links from around the internet and present them in an organized format. We have no control over the nature, content, or availability of the material found on these third-party sites. If copyrighted content appears through our indexing, the responsibility lies with the third-party host, not with ${config.siteName || "WebStreaming"}.
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
          ${config.siteName || "WebStreaming"} is provided on an "as is" basis. We make no guarantees regarding the accuracy, legality, or availability of any third-party content that may be accessed through our service. Users are solely responsible for ensuring that their use of any content complies with all applicable local, national, and international laws. By using ${config.siteName || "WebStreaming"}, you acknowledge and agree that we bear no liability for any content accessed through third-party links indexed by our platform.
        </p>
      </section>
    </div>
  `;

  return (
    <div className="min-h-screen bg-zinc-950 pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto bg-zinc-900/50 border border-white/5 p-8 sm:p-12 rounded-3xl shadow-2xl backdrop-blur-sm">
        <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">DMCA Policy</h1>
        <p className="text-zinc-500 text-sm mb-10 border-b border-white/10 pb-6">
          Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </p>
        
        {/* Render HTML Content */}
        <div 
          className="prose prose-invert prose-red max-w-none"
          dangerouslySetInnerHTML={{ __html: dmcaHtml }}
        />
      </div>
    </div>
  );
}
