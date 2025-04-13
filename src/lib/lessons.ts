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
    return prisma.lesson.findUnique({
        where: { slug },
    });
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
    }));
}
