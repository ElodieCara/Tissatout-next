import { prisma } from "@/lib/prisma";

export async function getRandomSuggestions(type: string, limit: number = 5,
    options?: {
        excludeId?: string; category?: string;
        ageCategoryIds?: string[];
    }) {
    switch (type) {
        case "articles":
            return prisma.article.findMany({
                where: {
                    id: { not: options?.excludeId },
                    category: options?.category,
                },
                orderBy: { date: "desc" },
                take: limit,
            }).then((articles) =>
                articles.map((article) => ({
                    id: article.id,
                    type: "articles",
                    slug: article.slug,
                    title: article.title,
                    image: article.image ?? null,
                    description: article.description ?? null,
                    date: article.date ? article.date.toISOString() : null, // ✅ Conversion ici
                }))
            );

        case "conseils":
            return prisma.advice.findMany({
                where: {
                    id: { not: options?.excludeId },
                    category: options?.category,
                },
                orderBy: { createdAt: "desc" },
                take: limit,
            }).then((conseils) =>
                conseils.map((conseil) => ({
                    id: conseil.id,
                    type: "conseils",
                    slug: conseil.slug,
                    title: conseil.title,
                    image: conseil.imageUrl ?? null,
                    description: conseil.description ?? null,
                    date: conseil.createdAt ? conseil.createdAt.toISOString() : null,
                }))
            );

        case "idees":
            return prisma.idea.findMany({
                where: {
                    id: { not: options?.excludeId },
                    ageCategories: options?.ageCategoryIds?.length
                        ? {
                            some: {
                                ageCategoryId: { in: options.ageCategoryIds }
                            }
                        }
                        : undefined,
                },
                orderBy: { createdAt: "desc" },
                take: limit,
            }).then((idees) =>
                idees.map((idee) => ({
                    id: idee.id,
                    type: "idees",
                    slug: idee.slug,
                    title: idee.title,
                    image: idee.image ?? null,
                    description: idee.description ?? null,
                    date: idee.createdAt ? idee.createdAt.toISOString() : null,
                }))
            );

        case "trivium":
        case "quadrivium":
            return prisma.lesson.findMany({
                where: {
                    id: { not: options?.excludeId },
                    module: type,
                },
                orderBy: { createdAt: "desc" },
                take: limit,
            }).then((lessons) =>
                lessons.map((lesson) => ({
                    id: lesson.id,
                    type,
                    slug: lesson.slug,
                    title: lesson.title,
                    image: lesson.image ?? null,
                    description: lesson.summary ?? null,
                    age: lesson.ageTag ?? null,
                    date: lesson.createdAt ? lesson.createdAt.toISOString() : null,
                }))
            );

        case "coloriages":
            return prisma.drawing.findMany({
                where: {
                    id: { not: options?.excludeId },
                    category: options?.category ? { name: options.category } : undefined,
                },
                orderBy: { createdAt: "desc" },
                take: limit,
            }).then((drawings) =>
                drawings.map((drawing) => ({
                    id: drawing.id,
                    type: "coloriages",
                    slug: drawing.slug,
                    title: drawing.title,
                    image: drawing.imageUrl ?? null,
                    description: null,
                    date: drawing.createdAt ? drawing.createdAt.toISOString() : null,
                }))
            );

        default:
            return [];
    }
}
