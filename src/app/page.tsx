import ThemeProvider from "@/components/Decorations/Themes/ThemeProvider";
import HomeContent from "./HomeContent";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

// ✅ Base URL sûre (dev/preview/prod)
async function getBaseUrl() {
  const h = await headers(); // <- await requis
  const proto = h.get("x-forwarded-proto") ?? "http";
  const host = h.get("x-forwarded-host") ?? h.get("host");
  return `${proto}://${host}`;
}

// ✅ Récupération des articles côté serveur (ISR)
async function getArticles() {
  const baseUrl = await getBaseUrl();
  const res = await fetch(`${baseUrl}/api/articles`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error("Erreur de récupération des articles");
  return res.json();
}

export default async function HomePage() {
  const [articles, settings] = await Promise.all([
    getArticles(),
    prisma.siteSettings.findFirst(),
  ]);

  const homeBanners = settings?.homeBanners?.length
    ? settings.homeBanners
    : ["/assets/slide1.jpg"];

  const homeTitle = settings?.homeTitle || "🎨 Bienvenue sur Tissatout !";
  const homeDesc =
    settings?.homeDesc ||
    "Explorez des idées et activités pour éveiller les enfants de tous âges.";

  return (
    <ThemeProvider>
      <HomeContent
        articles={articles}
        homeBanners={homeBanners}
        homeTitle={homeTitle}
        homeDesc={homeDesc}
      />
    </ThemeProvider>
  );
}
