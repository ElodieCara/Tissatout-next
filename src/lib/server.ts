import "server-only";
import prisma from "@/lib/prisma"; // ✅ Utilisation de Prisma
import { Drawing } from "@/types/drawing";
import { headers } from "next/headers";

// ✅ Base URL sûre (dev/preview/prod) — aucun localhost en prod
async function getBaseUrl() {
    // 1) Fallback explicite si tu déclares BASE_URL sur Vercel
    if (process.env.BASE_URL) return process.env.BASE_URL;
    // 2) Déduire depuis la requête (fonctionne en dev/preview/prod)
    const h = await headers(); // <- sur ton setup, TS attend un await
    const proto = h.get("x-forwarded-proto") ?? "http";
    const host = h.get("x-forwarded-host") ?? h.get("host");
    return `${proto}://${host}`;
}

/** ✅ Récupère toutes les inspirations */
export async function getInspirationData() {
    const baseUrl = await getBaseUrl();

    const [articlesRes, ideasRes, adviceRes] = await Promise.all([
        fetch(`${baseUrl}/api/articles`, { next: { revalidate: 60 } }),
        fetch(`${baseUrl}/api/ideas`, { next: { revalidate: 60 } }),
        fetch(`${baseUrl}/api/advice`, { next: { revalidate: 60 } }),
    ]);

    if (!articlesRes.ok || !ideasRes.ok || !adviceRes.ok) {
        throw new Error("Erreur lors de la récupération des données.");
    }

    return {
        articles: await articlesRes.json(),
        ideas: await ideasRes.json(),
        advices: await adviceRes.json(),
    };
}

/** ✅ Récupère tous les coloriages */
export async function getDrawings(): Promise<Drawing[]> {
    const drawings = await prisma.drawing.findMany({
        include: { category: true },
        orderBy: { createdAt: "desc" },
    });

    console.log("📸 Données récupérées depuis Prisma:", drawings); // 🔍 Vérification

    return drawings.map(d => ({
        id: d.id,
        title: d.title,
        imageUrl: d.imageUrl,
        views: d.views ?? 0,
        likes: d.likes ?? 0,
        slug: d.slug ?? "",
        createdAt: d.createdAt,
        description: d.description,
        category: d.category ? { id: d.category.id, name: d.category.name } : undefined,
    }));
}

/** ✅ Récupère un coloriage spécifique par son ID */
export async function getDrawingById(id: string): Promise<Drawing | null> {
    console.log("🔍 Recherche du dessin avec l'ID :", id);

    try {
        const drawing = await prisma.drawing.update({
            where: { id },
            data: { views: { increment: 1 } },
            include: { category: true }, // ✅ Inclure la catégorie pour éviter les erreurs
        });

        return {
            id: drawing.id,
            title: drawing.title,
            imageUrl: drawing.imageUrl,
            views: drawing.views ?? 0,
            likes: drawing.likes ?? 0,
            slug: drawing.slug ?? "",
            createdAt: drawing.createdAt,
            description: drawing.description,
            category: drawing.category ? { name: drawing.category.name } : undefined,
        };

    } catch (error) {
        console.error("❌ Erreur Prisma :", error);
        return null;
    }
}

/** ✅ Récupère des dessins similaires */
export async function getSimilarDrawings(category: string, currentId: string, limit: number = 4) {
    return prisma.drawing.findMany({
        where: {
            category: { name: category },
            id: { not: currentId }
        },
        include: { category: true },
        orderBy: { createdAt: "desc" },
        take: limit,
    });
}

/** ✅ Récupère toutes les catégories + leurs dessins */
export async function getAllCategoriesWithDrawings() {

    const sections = await prisma.categorySection.findMany({
        include: { categories: true },
        orderBy: { name: "asc" },
    });

    const categoriesData: Record<string, string[]> = {
        // "Saisons et Fêtes": ["Hiver", "Printemps", "Été", "Automne", "Noël", "Halloween", "Pâques"],
        // "Thèmes": ["Animaux", "Véhicules", "Espace", "Pirates"],
        // "Âge": ["Tout Petits (0-3 ans)", "Dès 3 ans", "Dès 6 ans", "Dès 10 ans"],
        // "Éducatif & Trivium": [
        //     "Grammaire - Lettres", "Grammaire - Mots", "Grammaire - Chiffres",
        //     "Logique - Puzzle", "Logique - Coloriages numérotés", "Logique - Labyrinthe",
        //     "Rhétorique - Histoires", "Rhétorique - Mythologie", "Rhétorique - Philosophie"
        // ]
    };
    for (const section of sections) {
        categoriesData[section.name] = section.categories.map((cat) => cat.name);
    }

    const drawings = await prisma.drawing.findMany({
        include: { category: true },
        orderBy: { createdAt: "desc" },
    });

    const drawingsByCategory: Record<string, Drawing[]> = {};
    const topImages: Record<string, { imageUrl: string; likes: number }> = {};
    const coloringCounts: Record<string, number> = {};

    for (const drawing of drawings) {
        if (!drawing.category?.name) continue;
        const category = drawing.category.name;
        if (!drawingsByCategory[category]) {
            drawingsByCategory[category] = [];
        }
        drawingsByCategory[category].push(drawing);

        if (!topImages[category] || drawing.likes > (topImages[category]?.likes ?? 0)) {
            topImages[category] = { imageUrl: drawing.imageUrl, likes: drawing.likes ?? 0 };
        }

        coloringCounts[category] = (coloringCounts[category] || 0) + 1;
    }

    return { categoriesData, drawingsByCategory, topImages, coloringCounts };
}

/** ✅ Récupère les coloriages éducatifs (Trivium & Quadrivium) */
export async function getEducationalDrawings(): Promise<Record<string, Drawing[]>> {
    const categoriesData: Record<string, string[]> = {
        "Éducatif & Trivium": [
            "Grammaire - Lettres",
            "Grammaire - Mots",
            "Grammaire - Chiffres",
            "Logique - Puzzle",
            "Logique - Coloriages numérotés",
            "Logique - Labyrinthe",
            "Rhétorique - Histoires",
            "Rhétorique - Mythologie",
            "Rhétorique - Philosophie"
        ]
    };

    const educationalCategory = "Éducatif & Trivium";
    const subCategories = categoriesData[educationalCategory]?.slice(0, 3);

    const educationalDrawings: Record<string, Drawing[]> = {};

    for (const subCategory of subCategories) {
        const drawings = await prisma.drawing.findMany({
            where: { category: { name: subCategory } },
            orderBy: { likes: "desc" },
            take: 1, // ✅ Récupère uniquement le coloriage le plus aimé
            include: { category: true }
        });

        educationalDrawings[subCategory] = drawings.map(d => ({
            id: d.id,
            title: d.title,
            imageUrl: d.imageUrl,
            views: d.views ?? 0,
            likes: d.likes ?? 0,
            slug: d.slug ?? "",
            createdAt: d.createdAt,
            description: d.description,
            category: d.category ? { id: d.category.id, name: d.category.name } : undefined
        }));
    }

    return educationalDrawings;
}

/** ✅ Récupère les coloriages les plus likés */
export async function getTopLikedDrawings(limit: number = 4): Promise<Drawing[]> {
    const drawings = await prisma.drawing.findMany({
        orderBy: { likes: "desc" }, // ✅ Trie par nombre de likes décroissant
        take: limit, // ✅ Prend les X premiers dessins les plus aimés
        include: { category: true },
    });

    return drawings.map(d => ({
        id: d.id,
        title: d.title,
        imageUrl: d.imageUrl,
        views: d.views ?? 0,
        likes: d.likes ?? 0,
        category: d.category ? { id: d.category.id, name: d.category.name } : undefined,
        slug: d.slug ?? "",
        description: d.description,
        createdAt: d.createdAt,
    }));
}

/** ✅ Récupère les dessins les plus vus */
export async function getTrendingDrawings(limit: number = 4): Promise<Drawing[]> {
    const drawings = await prisma.drawing.findMany({
        orderBy: { views: "desc" }, // ✅ Trie par nombre de vues décroissant
        take: limit, // ✅ Prend les X premiers dessins les plus vus
        include: { category: true }, // ✅ Inclut la catégorie pour éviter les erreurs TypeScript
    });

    return drawings.map(d => ({
        id: d.id,
        title: d.title,
        imageUrl: d.imageUrl,
        views: d.views ?? 0,
        likes: d.likes ?? 0,
        slug: d.slug ?? "",
        createdAt: d.createdAt,
        description: d.description,
        category: d.category ? { id: d.category.id, name: d.category.name } : undefined,
    }));
}

/** ✅ Récupère un coloriage spécifique par son SLUG */
export async function getDrawingBySlug(slug: string): Promise<Drawing | null> {
    console.log("🔍 Recherche du dessin avec le SLUG :", slug);

    try {
        // Étape 1 : Trouver le dessin via le SLUG
        const drawing = await prisma.drawing.findUnique({
            where: { slug }, // ✅ Vérifie que slug est bien unique
            include: { category: true }, // ✅ Inclure la catégorie pour éviter les erreurs
        });

        if (!drawing) return null; // ❌ Ne pas faire d'update si le dessin n'existe pas

        // Étape 2 : Incrémenter les vues
        await prisma.drawing.update({
            where: { id: drawing.id }, // ✅ On met à jour avec l'ID (toujours unique)
            data: { views: { increment: 1 } }, // ✅ Incrémente les vues
        });

        return {
            id: drawing.id,
            title: drawing.title,
            imageUrl: drawing.imageUrl,
            views: drawing.views ?? 0,
            likes: drawing.likes ?? 0,
            slug: drawing.slug ?? "",
            createdAt: drawing.createdAt,
            description: drawing.description,
            category: drawing.category ? { name: drawing.category.name } : undefined,
        }; // ✅ Retourne le dessin mis à jour

    } catch (error) {
        console.error("❌ Erreur Prisma :", error);
        return null;
    }
}

