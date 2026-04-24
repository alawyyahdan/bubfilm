import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NavbarWrapper from "@/components/NavbarWrapper";
import PageTracker from "@/components/PageTracker";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import AdBlockDetector from "@/components/AdBlockDetector";
import fs from "fs";
import path from "path";

const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  let config: any = {};
  try {
    const raw = fs.readFileSync(path.join(process.cwd(), "data", "site-config.json"), "utf-8");
    config = JSON.parse(raw);
  } catch {}

  const title = config.siteTitle || "Film - Watch Movies, TV Shows & Anime Free";
  const description = config.siteDescription || "Stream thousands of movies, TV shows, and anime for free on Film.";
  const siteUrl = config.siteUrl || process.env.NEXT_PUBLIC_SITE_URL || "https://bububfilm.com";
  // Fallback image if logo is not set so WhatsApp/FB still shows something nice
  const ogImage = config.ogImageUrl || config.logoImageUrl || "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1200&auto=format&fit=crop"; 

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    keywords: config.siteKeywords || "streaming, movies, tv shows, anime, free",
    icons: config.faviconUrl ? { icon: config.faviconUrl } : undefined,
    openGraph: {
      title: config.ogTitle || title,
      description: config.ogDescription || description,
      url: siteUrl,
      siteName: config.siteName || "Film",
      type: "website",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: config.siteName || "Site Logo",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: config.ogTitle || title,
      description: config.ogDescription || description,
      images: [ogImage],
    },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  let config: any = {};
  try {
    const raw = fs.readFileSync(path.join(process.cwd(), "data", "site-config.json"), "utf-8");
    config = JSON.parse(raw);
  } catch {}
  
  const favicon = config.faviconUrl || "";
  const siteUrl = config.siteUrl || process.env.NEXT_PUBLIC_SITE_URL || "https://bububfilm.com";
  const siteName = config.siteName || "Film";

  // Google Sitelinks Search Box Schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": siteName,
    "url": siteUrl,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${siteUrl}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        {favicon && <link rel="icon" href={favicon} />}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={inter.className} style={{ background: "#09090b", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <PageTracker />
        <NavbarWrapper />
        <main style={{ flex: 1 }}>{children}</main>
        <Footer />
        <ScrollToTop />
        <AdBlockDetector />
      </body>
    </html>
  );
}
