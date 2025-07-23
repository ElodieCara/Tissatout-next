// app/coloriages/page.tsx
import { getDrawings } from "@/lib/server";
import prisma from "@/lib/prisma";
import ColoriagePage from "./ColoriagesPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Coloriages à imprimer ✨ - Dessins gratuits à télécharger",
    description: "Des centaines de coloriages gratuits à imprimer et à colorier. Explorez nos thèmes : animaux, mandalas, héros et bien plus encore !",
    keywords: ["coloriage à imprimer", "dessin à colorier", "coloriage enfant", "mandalas", "hiver", "printemps", "été", "automne", "Noël"],
    openGraph: {
        title: "Coloriages à imprimer ✨ - Dessins gratuits à télécharger",
        description: "Des centaines de coloriages gratuits à imprimer et à colorier. Explorez nos thèmes : animaux, mandalas, héros et bien plus encore !",
        images: [{ url: "https://ton-site.com/assets/slide3.png" }],
        url: "https://ton-site.com/coloriages",
    },
    twitter: {
        card: "summary_large_image",
        title: "Coloriages à imprimer ✨ - Dessins gratuits à télécharger",
        description: "Des centaines de coloriages gratuits à imprimer et à colorier. Explorez nos thèmes : animaux, mandalas, héros et bien plus encore !",
        images: ["https://ton-site.com/assets/slide3.png"],
    },
};

export default async function Page() {
    const drawings = await getDrawings(); // ✅ Données des dessins

    const settings = await prisma.siteSettings.findFirst(); // ✅ Données des bannières

    // 🟡 Récupère dynamiquement les catégories pour chaque section
    const themesSection = await prisma.categorySection.findFirst({
        where: { name: "Thèmes" },
        include: { categories: true }
    });
    const agesSection = await prisma.categorySection.findFirst({
        where: { name: "Âge" },
        include: { categories: true }
    });
    // 🔧 CORRECTION : Utilise le bon nom de section
    const educatifSection = await prisma.categorySection.findFirst({
        where: { name: "Éducatif & Trivium" }, // ✅ Nom correct de votre section
        include: { categories: true }
    });

    const themes = themesSection?.categories || [];
    const ages = agesSection?.categories || [];
    const educatif = educatifSection?.categories || []; // ✅ Renommé pour plus de clarté

    const coloringBanner = settings?.coloringBanner || "/assets/slide3.png";
    const coloringTitle = settings?.coloringTitle || "🎨 Coloriages à imprimer";
    const coloringDesc = settings?.coloringDesc || "Des coloriages gratuits classés par saison, âge et thématique pour éveiller la créativité des enfants.";

    return (
        <ColoriagePage
            drawings={drawings}
            coloringBanner={coloringBanner}
            coloringTitle={coloringTitle}
            coloringDesc={coloringDesc}
            themes={themes}
            ages={ages}
            educatif={educatif} // ✅ Passe les catégories éducatives
        />
    );
}