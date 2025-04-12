import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateSlug } from "@/lib/utils";
import { Prisma } from "@prisma/client"; // ← 🟢 indispensable
import { ObjectId } from "mongodb"; // 👈 à ajouter en haut

export async function POST(req: Request) {
    try {
        const data = await req.json();

        const created = await prisma.lesson.create({
            data: {
                id: new ObjectId().toString(), // 👈 obligatoire avec @db.ObjectId
                order: data.order,
                title: data.title,
                slug: data.slug,
                chapterTitle: data.chapterTitle,
                personageName: data.personageName,
                personageDates: data.personageDates,
                personageNote: data.personageNote,
                collectionSlug: data.collectionSlug,
                category: data.category,
                subcategory: data.subcategory,
                summary: data.summary ?? "",
                content: data.content,
                revision: data.revision ?? "",
                homework: data.homework ?? "",
                image: data.image ?? null,
                published: data.published ?? true,
                ageTag: data.ageTag ?? null
            }
        });

        return NextResponse.json(created, { status: 201 });

    } catch (error) {
        console.error("🔥 ERREUR CRÉATION LEÇON :", error);
        return NextResponse.json({ error: "Erreur interne", details: `${error}` }, { status: 500 });
    }
}


// ✅ Récupération
export async function GET() {
    try {
        const lessons = await prisma.lesson.findMany({
            orderBy: { order: "asc" },
        });

        return NextResponse.json(lessons);
    } catch (error) {
        console.error("🔥 ERREUR GET MODULES :", error);
        return NextResponse.json({ error: "Erreur lors de la récupération des leçons." }, { status: 500 });
    }
}