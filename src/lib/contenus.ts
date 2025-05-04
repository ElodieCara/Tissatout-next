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
                },
            });

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
                },
            }).then((d) =>
                d.map(({ imageUrl, ...rest }) => ({ ...rest, image: imageUrl }))
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
                },
            }).then((d) =>
                d.map(({ image, ...rest }) => ({ ...rest, image: image }))
            );

        case "trivium":
        case "quadrivium":
            return prisma.lesson.findMany({
                where: {
                    module: type,
                    ageTag: ageCategory.slug,
                },
                select: {
                    id: true,
                    title: true,
                    slug: true,
                    image: true,
                    summary: true,
                },
            }).then((lessons) =>
                lessons.map(({ summary, ...rest }) => ({
                    ...rest,
                    description: summary, // 🧠 Adapté à ContentList
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
                },
            }).then(drawings =>
                drawings.map(({ imageUrl, ...rest }) => ({
                    ...rest,
                    image: imageUrl, // important pour ContentList
                }))
            );

        default:
            return [];
    }
}
