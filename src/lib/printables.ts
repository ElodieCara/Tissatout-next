import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";

// 🔠 Typage complet d'un jeu avec tous les champs nécessaires
export type FullPrintable = Prisma.PrintableGameGetPayload<{
    include: {
        themes: { include: { theme: true } },
        types: { include: { type: true } },
        extraImages: true,
    };
}>;

// 🔍 Obtenir un printable par son slug
export async function getPrintableBySlug(slug: string): Promise<FullPrintable | null> {
    return await prisma.printableGame.findFirst({
        where: { slug },
        include: {
            themes: { include: { theme: true } },
            types: { include: { type: true } },
            extraImages: true,
        },
    });
}

// 📚 Obtenir tous les slugs pour le SSG
export async function getAllPrintableSlugs() {
    const games = await prisma.printableGame.findMany({
        select: { slug: true },
    });
    return games.map((g) => ({ slug: g.slug }));
}

// 🧠 Obtenir des fiches similaires
export async function getSimilarPrintables(
    currentId: string,
    ageMin: number,
    ageMax: number,
    themeLabels: string[]
): Promise<FullPrintable[]> {
    return await prisma.printableGame.findMany({
        where: {
            id: { not: currentId },
            OR: [
                {
                    ageMin: { lte: ageMax },
                    ageMax: { gte: ageMin },
                },
                {
                    themes: {
                        some: {
                            theme: {
                                label: { in: themeLabels },
                            },
                        },
                    },
                },
            ],
        },
        take: 4,
        orderBy: { createdAt: "desc" },
        include: {
            themes: { include: { theme: true } },
            types: { include: { type: true } },
            extraImages: true,
        },
    });
}


export async function getMysteryGame(): Promise<FullPrintable | null> {
    return await prisma.printableGame.findFirst({
        where: {
            isMystery: true,
            mysteryUntil: { gte: new Date() },
        },
        include: {
            themes: { include: { theme: true } },
            types: { include: { type: true } },
            extraImages: true,
        },
    });
}

/**
 * Renvoie le catalogue public (hors mystère ou mystères expirés)
 */
export async function getPublicGames(): Promise<FullPrintable[]> {
    return await prisma.printableGame.findMany({
        where: {
            OR: [
                { isMystery: false },
                { mysteryUntil: { lt: new Date() } },
            ],
        },
        include: {
            themes: { include: { theme: true } },
            types: { include: { type: true } },
            extraImages: true,
        },
        orderBy: { createdAt: "desc" },
    });
}

export async function getServerSideProps() {
    const mystery = await getMysteryGame();

    return {
        props: {
            mystery: mystery ? {
                slug: mystery.slug,
                mysteryUntil: mystery.mysteryUntil?.toISOString() ?? null,
            } : null,
        },
    };
}
