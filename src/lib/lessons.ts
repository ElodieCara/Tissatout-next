import { PrismaClient } from "@prisma/client";
import type { Lesson } from "@/types/lessons";

const prisma = new PrismaClient();

export async function getTriviumLessons(): Promise<Lesson[]> {
    const lessons = await prisma.lesson.findMany({
        where: {
            category: {
                in: ["Grammaire", "Logique", "Rhétorique"],
            },
            published: true,
        },
        include: {
            collection: true, // 🔥 ici !
        },
        orderBy: { order: "asc" },
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

    return lesson;
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
        include: {
            lessons: {
                where: { published: true },
                orderBy: { order: "asc" },
                include: {
                    collection: {
                        select: {
                            id: true,
                            slug: true,
                            title: true,
                            module: true as const, // ← ici c'est encore un string !
                        },
                    },
                },
            },
        },
        orderBy: { title: "asc" },
    });

    // 🔧 On force le module et le typage de collection
    return collections.map((col) => ({
        ...col,
        module: module as "trivium" | "quadrivium", // 👈 ici
        lessons: col.lessons.map((lesson) => ({
            ...lesson,
            module: module as "trivium" | "quadrivium", // 👈 aussi ici
            collection: lesson.collection
                ? {
                    ...lesson.collection,
                    module: module as "trivium" | "quadrivium", // 👈 encore ici
                }
                : null,
        })),
    }));
}


