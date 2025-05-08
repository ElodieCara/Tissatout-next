import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Définition du type unique pour les suggestions
type Suggestion = {
    id: string;
    slug: string;
    title: string;
    image: string | null;
    description: string | null;
    date?: string | null;
    age: string | null;
};

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    if (!type) {
        return NextResponse.json({ error: "Type is required" }, { status: 400 });
    }

    try {
        let suggestions: Suggestion[] = [];

        switch (type) {
            case "articles":
                suggestions = await prisma.article.findMany({
                    orderBy: {
                        date: "desc",
                    },
                    take: 5,
                    include: {
                        ageCategories: {
                            include: {
                                ageCategory: true,
                            },
                        },
                    }
                }).then((articles) =>
                    articles.map((article) => ({
                        id: article.id,
                        slug: article.slug,
                        title: article.title,
                        image: article.image,
                        description: article.description,
                        date: article.date ? article.date.toISOString() : null,
                        age: article.ageCategories.length > 0
                            ? article.ageCategories.map((cat) => cat.ageCategory.title).join(", ")
                            : "Âge inconnu",
                    }))
                );
                break;

            case "conseils":
                suggestions = await prisma.advice.findMany({
                    orderBy: {
                        createdAt: "desc",
                    },
                    take: 5,
                    include: {
                        ageCategories: {
                            include: {
                                ageCategory: true,
                            },
                        },
                    }
                }).then((conseils) =>
                    conseils.map((conseil) => ({
                        id: conseil.id,
                        slug: conseil.slug,
                        title: conseil.title,
                        image: conseil.imageUrl,
                        description: conseil.description ?? null,
                        date: conseil.createdAt ? conseil.createdAt.toISOString() : null,
                        age: conseil.ageCategories.length > 0
                            ? conseil.ageCategories.map((cat) => cat.ageCategory.title).join(", ")
                            : "Âge inconnu",
                    }))
                );
                break;

            case "idees":
                suggestions = await prisma.idea.findMany({
                    orderBy: {
                        createdAt: "desc",
                    },
                    take: 5,
                    include: {
                        ageCategories: {
                            include: {
                                ageCategory: true,
                            },
                        },
                    }
                }).then((idees) =>
                    idees.map((idee) => ({
                        id: idee.id,
                        slug: idee.slug,
                        title: idee.title,
                        image: idee.image,
                        description: idee.description ?? null,
                        date: idee.createdAt ? idee.createdAt.toISOString() : null,
                        age: idee.ageCategories.length > 0
                            ? idee.ageCategories.map((cat) => cat.ageCategory.title).join(", ")
                            : "Âge inconnu",
                    }))
                );
                break;

            case "trivium":
            case "quadrivium":
                suggestions = await prisma.lesson.findMany({
                    where: { module: type },
                    orderBy: {
                        createdAt: "desc",
                    },
                    take: 5,
                    select: {
                        id: true,
                        slug: true,
                        title: true,
                        image: true,
                        summary: true,
                        createdAt: true,
                        ageTag: true,  // 👈 Ajout de la tranche d'âge ici
                    },
                }).then((lessons) =>
                    lessons.map((lesson) => ({
                        id: lesson.id,
                        slug: lesson.slug,
                        title: lesson.title,
                        image: lesson.image,
                        description: lesson.summary ?? null,
                        date: lesson.createdAt ? lesson.createdAt.toISOString() : null,
                        age: lesson.ageTag ?? "Âge inconnu",
                    }))
                );
                break;

            case "coloriages":
                suggestions = await prisma.drawing.findMany({
                    orderBy: {
                        createdAt: "desc",
                    },
                    take: 5,
                    include: {
                        ageCategories: {
                            include: {
                                ageCategory: true,
                            },
                        },
                    }
                }).then((drawings) =>
                    drawings.map((drawing) => ({
                        id: drawing.id,
                        slug: drawing.slug,
                        title: drawing.title,
                        image: drawing.imageUrl,
                        description: null,
                        date: drawing.createdAt ? drawing.createdAt.toISOString() : null,
                        age: drawing.ageCategories.length > 0
                            ? drawing.ageCategories.map((cat) => cat.ageCategory.title).join(", ")
                            : "Âge inconnu",
                    }))
                );
                break;

            default:
                suggestions = [];
        }

        return NextResponse.json(suggestions);

    } catch (error) {
        console.error("Erreur lors de la récupération des suggestions :", error);
        return NextResponse.json({ error: "Erreur lors de la récupération des suggestions" }, { status: 500 });
    }
}
