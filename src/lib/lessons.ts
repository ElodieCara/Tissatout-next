import { PrismaClient } from "@prisma/client";
import type { Lesson } from "@/types/lessons";

const prisma = new PrismaClient();

export async function getTriviumLessons(): Promise<Lesson[]> {
    const lessons = await prisma.lesson.findMany({
        where: {
            category: { in: ["Grammaire", "Logique", "Rhétorique"] },
            published: true,
        },
        orderBy: { order: "asc" },
        select: {
            id: true,
            order: true,
            title: true,
            slug: true,
            chapterTitle: true,
            personageName: true,
            personageDates: true,
            personageNote: true,
            period: true,
            category: true,
            subcategory: true,
            summary: true,
            content: true,
            revision: true,
            homework: true,
            ageTag: true,
            published: true,
            module: true,
            collectionId: true,
            image: true,
            createdAt: true,
            collection: {
                select: {
                    id: true,
                    slug: true,
                    title: true,
                    module: true,
                }
            }
        }
    });

    return lessons as Lesson[];
}


export async function getLessonBySlug(slug: string): Promise<Lesson | null> {
    const lesson = await prisma.lesson.findUnique({
        where: { slug },
        select: {
            id: true,
            title: true,
            slug: true,
            order: true,
            image: true,
            chapterTitle: true,
            personageName: true,
            personageDates: true,
            personageNote: true,
            period: true,
            category: true,
            subcategory: true,
            summary: true,
            content: true,
            revision: true,
            homework: true,
            ageTag: true,
            published: true,
            module: true, // ✅ Ajoute le module ici aussi
            collectionId: true,
            createdAt: true,
        },
    });

    if (!lesson) return null;
    return {
        ...lesson,
        module: lesson.module === "trivium" ? "trivium"
            : lesson.module === "quadrivium" ? "quadrivium"
                : "trivium", // fallback sécurisé
    };
}

export async function getTriviumCollections() {
    const collections = await prisma.collection.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            lessons: {
                where: { published: true },
                select: { id: true }, // juste pour compter
            },
        },
    });

    return collections.map((col) => ({
        id: col.id,
        title: col.title,
        slug: col.slug,
        description: col.description,
        lessonsCount: col.lessons.length,
        module: col.module as "trivium" | "quadrivium",
    }));
}

export async function getCollectionsWithLessons(module: "trivium" | "quadrivium") {
    const collections = await prisma.collection.findMany({
        where: { module },
        orderBy: { title: "asc" },
        include: {
            lessons: {
                where: { published: true },
                orderBy: { order: "asc" },
                select: {
                    id: true,
                    order: true,
                    title: true,
                    slug: true,
                    chapterTitle: true,
                    personageName: true,
                    personageDates: true,
                    personageNote: true,
                    period: true,
                    category: true,
                    subcategory: true,
                    summary: true,
                    content: true,
                    revision: true,
                    homework: true,
                    ageTag: true,       // ← INDISPENSABLE
                    published: true,
                    module: true,       // ← INDISPENSABLE
                    collectionId: true,
                    image: true,
                    createdAt: true,
                    collection: {
                        select: {
                            id: true,
                            slug: true,
                            title: true,
                            module: true,
                        }
                    }
                }
            }
        }
    });


    // 🔧 On force le module et le typage de collection
    return collections.map((col) => ({
        ...col,
        module: module as "trivium" | "quadrivium",
        lessons: col.lessons.map((lesson) => ({
            ...lesson,
            module: lesson.module === "trivium" ? "trivium"
                : lesson.module === "quadrivium" ? "quadrivium"
                    : module, // fallback : le module du parent (toujours défini)
            collection: lesson.collection
                ? {
                    ...lesson.collection,
                    module: lesson.collection.module === "trivium"
                        ? "trivium"
                        : lesson.collection.module === "quadrivium"
                            ? "quadrivium"
                            : module, // fallback
                }
                : null,
        })),
    }));
}


