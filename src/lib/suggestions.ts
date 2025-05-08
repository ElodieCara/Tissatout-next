import { prisma } from "@/lib/prisma";

export async function getRandomSuggestions(type: string, limit: number = 5) {
    switch (type) {
        case "articles":
            return prisma.article.findMany({
                orderBy: {
                    date: "desc"
                },
                take: limit,
            }).then((articles) =>
                articles.map((article) => ({
                    ...article,
                    date: article.date ? article.date.toISOString() : null, // ✅ Conversion ici
                }))
            );

        case "conseils":
            return prisma.advice.findMany({
                orderBy: {
                    createdAt: "desc"
                },
                take: limit,
            }).then((conseils) =>
                conseils.map((conseil) => ({
                    ...conseil,
                    date: conseil.createdAt ? conseil.createdAt.toISOString() : null,
                }))
            );

        case "idees":
            return prisma.idea.findMany({
                orderBy: {
                    createdAt: "desc"
                },
                take: limit,
            }).then((idees) =>
                idees.map((idee) => ({
                    ...idee,
                    date: idee.createdAt ? idee.createdAt.toISOString() : null,
                }))
            );

        case "trivium":
        case "quadrivium":
            return prisma.lesson.findMany({
                where: { module: type },
                orderBy: {
                    createdAt: "desc"
                },
                take: limit,
            }).then((lessons) =>
                lessons.map((lesson) => ({
                    ...lesson,
                    date: lesson.createdAt ? lesson.createdAt.toISOString() : null,
                }))
            );

        case "coloriages":
            return prisma.drawing.findMany({
                orderBy: {
                    createdAt: "desc"
                },
                take: limit,
            }).then((drawings) =>
                drawings.map((drawing) => ({
                    ...drawing,
                    date: drawing.createdAt ? drawing.createdAt.toISOString() : null,
                }))
            );

        default:
            return [];
    }
}
