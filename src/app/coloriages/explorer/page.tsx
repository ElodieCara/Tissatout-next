import { getEducationalDrawings, getAllCategoriesWithDrawings, getTopLikedDrawings, getTrendingDrawings } from "@/lib/server";
import ExplorerPage from "./ExplorerPage";
import prisma from "@/lib/prisma";
import NewsletterBanner from "@/components/NewsletterBanner/NewsletterBanner";

export const metadata = {
    title: "Explorer les coloriages - Tissatout",
    description:
        "Découvrez des centaines de coloriages à imprimer gratuitement, classés par âge, thème, saison et pédagogie. Tissatout : l'exploration créative pour tous les enfants.",
    keywords: [
        "coloriages enfants",
        "coloriage à imprimer",
        "dessins gratuits",
        "activité éducative",
        "Tissatout",
        "trivium pour enfants",
        "saisons coloriages",
        "coloriage éducatif",
    ],
    openGraph: {
        title: "Explorer les coloriages - Tissatout",
        description: "Coloriages à imprimer gratuits pour tous les âges. Explorez par thème, saison ou pédagogie.",
        images: ["/images/banner.jpg"],
    },
};

export default async function Page() {
    // 🔹 Données des dessins
    const educationalDrawings = await getEducationalDrawings();
    const { drawingsByCategory, topImages, coloringCounts } = await getAllCategoriesWithDrawings();
    const topLikedDrawings = await getTopLikedDrawings();
    const trendingDrawings = await getTrendingDrawings();

    // 🔸 Données du bandeau dynamique depuis SiteSettings
    const settings = await prisma.siteSettings.findFirst();

    const coloringBanner = settings?.coloringBanner || "/assets/slide3.png";
    const coloringTitle = settings?.coloringTitle || "🎨 Bienvenue dans l'univers des coloriages !";
    const coloringDesc = settings?.coloringDesc || "Explorez des centaines de coloriages gratuits à imprimer.";

    return (
        <>
            <ExplorerPage
                educationalDrawings={educationalDrawings}
                drawingsByCategory={drawingsByCategory}
                topImages={topImages}
                coloringCounts={coloringCounts}
                topLikedDrawings={topLikedDrawings}
                trendingDrawings={trendingDrawings}
                coloringBanner={coloringBanner}
                coloringTitle={coloringTitle}
                coloringDesc={coloringDesc}
            />
            <NewsletterBanner />
        </>
    );
}

export const revalidate = 60; // ✅ ISR : met à jour toutes les 60 secondes
