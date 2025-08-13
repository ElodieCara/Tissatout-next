// src/lib/server.ts
import "server-only";
import prisma from "@/lib/prisma";
import { Drawing } from "@/types/drawing";

/** ✅ Données d’inspiration sans fetch interne (direct DB) */
export async function getInspirationData() {
    try {
        const [articles, ideas, advices] = await Promise.all([
            prisma.article.findMany({ orderBy: { id: "desc" }, take: 100 }),
            prisma.idea.findMany({ orderBy: { id: "desc" }, take: 100 }),
            prisma.advice.findMany({ orderBy: { id: "desc" }, take: 100 }),]);
        return { articles, ideas, advices };
    } catch (e) {
        console.error("getInspirationData Prisma error:", e);
        // 👉 on ne fait PAS planter la page
        return { articles: [], ideas: [], advices: [] };
    }
}

/** ✅ Récupère tous les coloriages */
export async function getDrawings(): Promise<Drawing[]> {
    const drawings = await prisma.drawing.findMany({
        include: { category: true },
        orderBy: { createdAt: "desc" },
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

/** ✅ Récupère un coloriage par ID (et incrémente les vues) */
export async function getDrawingById(id: string): Promise<Drawing | null> {
    try {
        const drawing = await prisma.drawing.update({
            where: { id },
            data: { views: { increment: 1 } },
            include: { category: true },
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

/** ✅ Dessins similaires */
export async function getSimilarDrawings(category: string, currentId: string, limit = 4) {
    return prisma.drawing.findMany({
        where: { category: { name: category }, id: { not: currentId } },
        include: { category: true },
        orderBy: { createdAt: "desc" },
        take: limit,
    });
}

/** ✅ Catégories + dessins */
export async function getAllCategoriesWithDrawings() {
    const sections = await prisma.categorySection.findMany({
        include: { categories: true },
        orderBy: { name: "asc" },
    });

    const categoriesData: Record<string, string[]> = {};
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

    for (const d of drawings) {
        const cat = d.category?.name;
        if (!cat) continue;

        (drawingsByCategory[cat] ||= []).push(d as unknown as Drawing);
        if (!topImages[cat] || (d.likes ?? 0) > topImages[cat].likes) {
            topImages[cat] = { imageUrl: d.imageUrl, likes: d.likes ?? 0 };
        }
        coloringCounts[cat] = (coloringCounts[cat] || 0) + 1;
    }

    return { categoriesData, drawingsByCategory, topImages, coloringCounts };
}

/** ✅ Éducatif (Trivium) */
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
            "Rhétorique - Philosophie",
        ],
    };

    const educationalCategory = "Éducatif & Trivium";
    const subCategories = categoriesData[educationalCategory]?.slice(0, 3);
    const educationalDrawings: Record<string, Drawing[]> = {};

    for (const sub of subCategories) {
        const list = await prisma.drawing.findMany({
            where: { category: { name: sub } },
            orderBy: { likes: "desc" },
            take: 1,
            include: { category: true },
        });

        educationalDrawings[sub] = list.map(d => ({
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

    return educationalDrawings;
}

/** ✅ Top likés */
export async function getTopLikedDrawings(limit = 4): Promise<Drawing[]> {
    const drawings = await prisma.drawing.findMany({
        orderBy: { likes: "desc" },
        take: limit,
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

/** ✅ Tendances (plus vus) */
export async function getTrendingDrawings(limit = 4): Promise<Drawing[]> {
    const drawings = await prisma.drawing.findMany({
        orderBy: { views: "desc" },
        take: limit,
        include: { category: true },
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

/** ✅ Par slug (+1 vue) */
export async function getDrawingBySlug(slug: string): Promise<Drawing | null> {
    try {
        const drawing = await prisma.drawing.findUnique({
            where: { slug },
            include: { category: true },
        });
        if (!drawing) return null;

        await prisma.drawing.update({
            where: { id: drawing.id },
            data: { views: { increment: 1 } },
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
