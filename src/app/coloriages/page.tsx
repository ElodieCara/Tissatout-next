// app/coloriages/page.tsx
import { getDrawings } from "@/lib/server";
import prisma from "@/lib/prisma";
import ColoriagePage from "./ColoriagesPage"; // Client Component

export default async function Page() {
    const drawings = await getDrawings(); // ✅ Données des dessins

    const settings = await prisma.siteSettings.findFirst(); // ✅ Données des bannières

    const coloringBanner = settings?.coloringBanner || "/assets/slide3.png";
    const coloringTitle = settings?.coloringTitle || "🎨 Coloriages à imprimer";
    const coloringDesc = settings?.coloringDesc || "Des coloriages gratuits classés par saison, âge et thématique pour éveiller la créativité des enfants.";

    return (
        <ColoriagePage
            drawings={drawings}
            coloringBanner={coloringBanner}
            coloringTitle={coloringTitle}
            coloringDesc={coloringDesc}
        />
    );
}
