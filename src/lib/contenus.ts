// import { prisma } from "@/lib/prisma";

// export async function getContenusParAgeEtType(ageSlug: string, type: string) {
//     const ageCategory = await prisma.ageCategory.findUnique({
//         where: { slug: ageSlug },
//     });
//     if (!ageCategory) return [];

//     switch (type) {
//         case "articles":
//             return prisma.article.findMany({
//                 where: {
//                     ageCategories: {
//                         some: { ageCategoryId: ageCategory.id },
//                     },
//                 },
//                 select: {
//                     id: true,
//                     title: true,
//                     slug: true,
//                     image: true,
//                     description: true,
//                     date: true,
//                     iconSrc: true,
//                     category: true, 
//                 },
//             });

//         case "conseils":
//             return prisma.advice.findMany({
//                 where: {
//                     ageCategories: {
//                         some: { ageCategoryId: ageCategory.id },
//                     },
//                 },
//                 select: {
//                     id: true,
//                     title: true,
//                     slug: true,
//                     imageUrl: true,
//                     description: true,
//                 },
//             }).then((d) =>
//                 d.map(({ imageUrl, ...rest }) => ({ ...rest, image: imageUrl }))
//             );

//         case "idees":
//             return prisma.idea.findMany({
//                 where: {
//                     ageCategories: {
//                         some: { ageCategoryId: ageCategory.id },
//                     },
//                 },
//                 select: {
//                     id: true,
//                     title: true,
//                     slug: true,
//                     image: true,
//                     description: true,                    
//                 },
//             }).then((d) =>
//                 d.map(({ image, ...rest }) => ({ ...rest, image: image }))
//             );

//         case "trivium":
//         case "quadrivium":
//             return prisma.lesson.findMany({
//                 where: {
//                     module: type,
//                     ageTag: ageCategory.slug,
//                 },
//                 select: {
//                     id: true,
//                     title: true,
//                     slug: true,
//                     image: true,
//                     summary: true,
//                 },
//             }).then((lessons) =>
//                 lessons.map(({ summary, ...rest }) => ({
//                     ...rest,
//                     description: summary, // 🧠 Adapté à ContentList
//                 }))
//             );

//         case "coloriages":
//             return prisma.drawing.findMany({
//                 where: {
//                     ageCategories: {
//                         some: { ageCategoryId: ageCategory.id },
//                     },
//                 },
//                 select: {
//                     id: true,
//                     title: true,
//                     slug: true,
//                     imageUrl: true,
//                 },
//             }).then(drawings =>
//                 drawings.map(({ imageUrl, ...rest }) => ({
//                     ...rest,
//                     image: imageUrl, // important pour ContentList
//                 }))
//             );

//         default:
//             return [];
//     }
// }

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
                    module: type,
                    ageTag: ageCategory.slug,
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
                }))
            );

        default:
            return [];
    }
}


// lib/contenus.ts
// import { prisma } from "./prisma";

// export async function getContenusParAgeEtType(ageSlug: string, type: string) {
//     const age = await prisma.ageCategory.findUnique({
//         where: { slug: ageSlug },
//     });

//     if (!age) return [];

//     switch (type) {
//         case "articles": {
//             const data = await prisma.article.findMany({
//                 where: {
//                     ageCategories: {
//                         some: { ageCategoryId: age.id },
//                     },
//                 },
//                 orderBy: { date: "desc" },
//             });

//             return data.map((item) => ({
//                 id: item.id,
//                 title: item.title,
//                 slug: item.slug,
//                 description: item.description,
//                 date: item.date?.toISOString(),
//                 image: item.image,
//                 tagLabel: item.category ?? null,
//                 iconSrc: item.iconSrc ?? null,
//             }));
//         }

//         case "conseils": {
//             const data = await prisma.advice.findMany({
//                 where: {
//                     ageCategories: {
//                         some: { ageCategoryId: age.id },
//                     },
//                 },
//                 orderBy: { createdAt: "desc" },
//             });

//             return data.map((item) => ({
//                 id: item.id,
//                 title: item.title,
//                 slug: item.slug,
//                 description: item.description,
//                 date: item.createdAt.toISOString(),
//                 image: item.imageUrl,
//                 tagLabel: item.category ?? null,
//             }));
//         }

//         case "idees": {
//             const data = await prisma.idea.findMany({
//                 where: {
//                     ageCategories: {
//                         some: { ageCategoryId: age.id },
//                     },
//                 },
//                 orderBy: { createdAt: "desc" },
//             });

//             return data.map((item) => ({
//                 id: item.id,
//                 title: item.title,
//                 slug: item.slug,
//                 description: item.description,
//                 date: item.createdAt.toISOString(),
//                 image: item.image,
//                 tagLabel: item.theme ?? null,
//             }));
//         }

//         case "trivium":
//         case "quadrivium": {
//             const module = type;
//             const data = await prisma.lesson.findMany({
//                 where: {
//                     module,
//                     ageTag: age.title,
//                     published: true,
//                 },
//                 orderBy: { createdAt: "desc" },
//             });

//             return data.map((item) => ({
//                 id: item.id,
//                 title: item.title,
//                 slug: item.slug,
//                 description: item.summary,
//                 date: item.createdAt.toISOString(),
//                 image: item.image,
//                 tagLabel: item.subcategory ?? item.category ?? null,
//             }));
//         }

//         case "coloriages": {
//             const data = await prisma.drawing.findMany({
//                 where: {
//                     ageCategories: {
//                         some: { ageCategoryId: age.id },
//                     },
//                 },
//                 orderBy: { createdAt: "desc" },
//             });

//             return data.map((item) => ({
//                 id: item.id,
//                 title: item.title,
//                 slug: item.slug,
//                 description: null,
//                 date: item.createdAt.toISOString(),
//                 image: item.imageUrl,
//                 tagLabel: null,
//             }));
//         }

//         default:
//             return [];
//     }
// }
