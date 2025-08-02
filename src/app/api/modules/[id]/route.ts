import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import path from "path";
import { unlink } from "fs/promises";
import { withAdminGuard } from "@/lib/auth.guard";

// 🔹 GET : Récupérer une seule leçon par ID
export async function GET(_: Request, { params }: { params: { id: string } }) {
    try {
        const lesson = await prisma.lesson.findUnique({
            where: { id: params.id },
        });

        if (!lesson) {
            return NextResponse.json({ error: "Leçon introuvable." }, { status: 404 });
        }

        return NextResponse.json(lesson);
    } catch (error) {
        console.error("Erreur GET module :", error);
        return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
    }
}

// 🔄 PUT : Mettre à jour une leçon
export async function PUT(req: NextRequest, context: { params: { id: string } }) {
    return withAdminGuard(req, async (_req) => {
        try {
            const data = await req.json();

            const updated = await prisma.lesson.update({
                where: { id: context.params.id },
                data: {
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
                    published: data.published,
                    module: data.module,
                    ...(data.collectionId && {
                        collection: {
                            connect: { id: data.collectionId },
                        },
                    }),
                },
            });

            return NextResponse.json(updated);
        } catch (error) {
            console.error("Erreur PUT module :", error);
            return NextResponse.json({ error: "Erreur lors de la mise à jour." }, { status: 500 });
        }
    });
}

// 🔴 DELETE : Supprimer une leçon
export async function DELETE(req: NextRequest, context: { params: { id: string } }) {
    return withAdminGuard(req, async () => {
        const { id } = context.params;

        if (!id) {
            return NextResponse.json({ error: "❌ ID manquant." }, { status: 400 });
        }

        // 1️⃣ Récupérer la leçon
        const lesson = await prisma.lesson.findUnique({
            where: { id },
            select: { image: true },
        });

        if (!lesson) {
            return NextResponse.json({ error: "❌ Leçon introuvable." }, { status: 404 });
        }

        // 2️⃣ Supprimer l’image physique si présente
        if (lesson.image) {
            const fileName = lesson.image.split("/uploads/")[1];
            if (fileName) {
                const filePath = path.join(process.cwd(), "public/uploads", fileName);
                await unlink(filePath).catch(err => {
                    if (err.code === "ENOENT") {
                        console.log("🔍 Image déjà absente");
                    } else {
                        console.error("❌ Erreur suppression image :", err);
                    }
                });
            }
        }

        // 3️⃣ Supprimer la leçon
        await prisma.lesson.delete({ where: { id } });

        return NextResponse.json({ message: "✅ Leçon supprimée avec image." });
    });
}