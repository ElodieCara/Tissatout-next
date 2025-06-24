import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { generateSlug } from "@/lib/utils";
import { ObjectId } from "mongodb";
import type { Lesson } from "@prisma/client";
import { withAdminGuard } from "@/lib/auth.guard";

// 🔐 POST: Création d'une leçon (réservée Admin uniquement)
export async function POST(req: NextRequest) {
    return withAdminGuard(req, async (_req) => {
        try {
            const data = await req.json();

            // 🔐 Validation stricte du module
            if (!data.module || !["trivium", "quadrivium"].includes(data.module)) {
                return NextResponse.json(
                    { error: "Module invalide ou manquant." },
                    { status: 400 }
                );
            }

            const created = await prisma.lesson.create({
                data: {
                    id: new ObjectId().toString(),
                    order: data.order,
                    title: data.title,
                    slug: data.slug,
                    chapterTitle: data.chapterTitle,
                    personageName: data.personageName,
                    personageDates: data.personageDates,
                    personageNote: data.personageNote,
                    category: data.category,
                    subcategory: data.subcategory,
                    summary: data.summary ?? "",
                    content: data.content,
                    revision: data.revision ?? "",
                    homework: data.homework ?? "",
                    image: data.image ?? null,
                    published: data.published ?? true,
                    ageTag: data.ageTag ?? null,
                    module: data.module, // ✅ ← AJOUT OBLIGATOIRE
                    ...(data.collectionId && {
                        collection: {
                            connect: { id: data.collectionId },
                        },
                    }),
                },
            });

            return NextResponse.json(created, { status: 201 });

        } catch (error) {
            console.error("🔥 ERREUR CRÉATION LEÇON :", error);
            return NextResponse.json(
                { error: "Erreur interne", details: `${error}` },
                { status: 500 }
            );
        }
    });
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