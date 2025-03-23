import { getEducationalDrawings, getAllCategoriesWithDrawings, getTopLikedDrawings, getTrendingDrawings } from "@/lib/server";
import ExplorerPage from "./ExplorerPage";
import prisma from "@/lib/prisma";

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
    );
}

export const revalidate = 60; // ✅ ISR : met à jour toutes les 60 secondes
