import ThemeProvider from "@/components/Decorations/Themes/ThemeProvider";
import Overview from "@/layout/Overview/Overview";
import Subscribe from "@/layout/Subscribe/Subscribe";
import HomeContent from "./HomeContent";
import prisma from "@/lib/prisma";

// 🟢 Récupération des articles côté serveur (SSR)
async function getArticles() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/articles`, {
    next: { revalidate: 60 }, // Régénération toutes les 60s (ISR)
  });

  if (!res.ok) {
    throw new Error("Erreur de récupération des articles");
  }

  return res.json();
}

export default async function HomePage() {
  const articles = await getArticles(); // Récupération des articles
  const settings = await prisma.siteSettings.findFirst();

  const homeBanner = settings?.homeBanner || "/assets/slide1.jpg";
  const homeTitle = settings?.homeTitle || "🎨 Bienvenue sur Tissatout !";
  const homeDesc =
    settings?.homeDesc ||
    "Explorez des idées et activités pour éveiller les enfants de tous âges.";

  return (
    <ThemeProvider>
      <HomeContent articles={articles}
        homeBanner={homeBanner}
        homeTitle={homeTitle}
        homeDesc={homeDesc} />
    </ThemeProvider>
  );
}
