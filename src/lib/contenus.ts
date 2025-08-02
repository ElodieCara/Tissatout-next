// lib/contenus.ts
import { prisma } from "@/lib/prisma";

export async function getContenusParAgeEtType(ageSlug: string, type: string) {
    const ageCategory = await prisma.ageCategory.findUnique({
        where: { slug: ageSlug },
    });
    if (!ageCategory) return [];

    switch (type) {
        case "articles":
            return prisma.article.findMany({
                where: {
                    ageCategories: {
                        some: { ageCategoryId: ageCategory.id },
                    },
                },
                select: {
                    id: true,
                    title: true,
                    slug: true,
                    image: true,
                    description: true,
                    date: true,
                    iconSrc: true,
                    category: true,
                },
            }).then((articles) =>
                articles.map((item) => ({
                    ...item,
                    date: item.date?.toISOString(),
                    tagLabel: item.category ?? null,
                }))
            );

        case "conseils":
            return prisma.advice.findMany({
                where: {
                    ageCategories: {
                        some: { ageCategoryId: ageCategory.id },
                    },
                },
                select: {
                    id: true,
                    title: true,
                    slug: true,
                    imageUrl: true,
                    description: true,
                    category: true,
                    createdAt: true,
                },
            }).then((items) =>
                items.map(({ imageUrl, category, createdAt, ...rest }) => ({
                    ...rest,
                    image: imageUrl,
                    date: createdAt.toISOString(),
                    tagLabel: category ?? null,
                }))
            );

        case "idees":
            return prisma.idea.findMany({
                where: {
                    ageCategories: {
                        some: { ageCategoryId: ageCategory.id },
                    },
                },
                select: {
                    id: true,
                    title: true,
                    slug: true,
                    image: true,
                    description: true,
                    theme: true,
                    createdAt: true,
                },
            }).then((items) =>
                items.map(({ createdAt, theme, ...rest }) => ({
                    ...rest,
                    date: createdAt.toISOString(),
                    tagLabel: theme ?? null,
                }))
            );

        case "trivium":
        case "quadrivium":
            return prisma.lesson.findMany({
                where: {
                    module: type as "trivium" | "quadrivium",
                    ageTag: ageCategory.slug,
                    published: true,
                },
                select: {
                    id: true,
                    title: true,
                    slug: true,
                    image: true,
                    summary: true,
                    category: true,
                    subcategory: true,
                    createdAt: true,
                },
            }).then((lessons) =>
                lessons.map(({ summary, category, subcategory, createdAt, ...rest }) => ({
                    ...rest,
                    description: summary,
                    date: createdAt.toISOString(),
                    module: type as "trivium" | "quadrivium",
                    tagLabel: subcategory ?? category ?? null,
                }))
            );

        case "coloriages":
            return prisma.drawing.findMany({
                where: {
                    ageCategories: {
                        some: { ageCategoryId: ageCategory.id },
                    },
                },
                select: {
                    id: true,
                    title: true,
                    slug: true,
                    imageUrl: true,
                    createdAt: true,
                },
            }).then(drawings =>
                drawings.map(({ imageUrl, createdAt, ...rest }) => ({
                    ...rest,
                    image: imageUrl,
                    date: createdAt.toISOString(),
                    tagLabel: null,
                    description: null,
                }))
            );

        default:
            return [];
    }
}


