import { getEducationalDrawings, getAllCategoriesWithDrawings, getTopLikedDrawings, getTrendingDrawings } from "@/lib/server";
import ExplorerPage from "./ExplorerPage";

export default async function Page() {
    // Récupération des données nécessaires
    const educationalDrawings = await getEducationalDrawings();
    const { drawingsByCategory, topImages, coloringCounts } = await getAllCategoriesWithDrawings();
    const topLikedDrawings = await getTopLikedDrawings();
    const trendingDrawings = await getTrendingDrawings();

    return (
        <ExplorerPage
            educationalDrawings={educationalDrawings}
            drawingsByCategory={drawingsByCategory}
            topImages={topImages}
            coloringCounts={coloringCounts}
            topLikedDrawings={topLikedDrawings}
            trendingDrawings={trendingDrawings}
        />
    );
}

export const revalidate = 60; // ✅ ISR : met à jour toutes les 60 secondes
