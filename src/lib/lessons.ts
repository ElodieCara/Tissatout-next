import { PrismaClient } from "@prisma/client";
import type { Lesson } from "@/types/lessons";

const prisma = new PrismaClient();

export async function getTriviumLessons(): Promise<Lesson[]> {
    return prisma.lesson.findMany({
        where: {
            category: {
                in: ["Grammaire", "Logique", "Rhétorique"],
            },
            published: true,
        },
        orderBy: { order: "asc" },
    });
}


export async function getLessonBySlug(slug: string): Promise<Lesson | null> {
    return prisma.lesson.findUnique({
        where: { slug },
    });
}
