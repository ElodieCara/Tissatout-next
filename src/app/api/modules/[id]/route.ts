import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

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
export async function PUT(req: Request, { params }: { params: { id: string } }) {

    try {
        const data = await req.json();

        const updated = await prisma.lesson.update({
            where: { id: params.id },
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
                collection: {
                    connect: { id: data.collectionId }
                },
            },
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error("Erreur PUT module :", error);
        return NextResponse.json({ error: "Erreur lors de la mise à jour." }, { status: 500 });
    }
}

// 🔴 DELETE : Supprimer une leçon
export async function DELETE(
    _req: Request,
    context: { params: { id: string } }
) {
    const { id } = context.params;

    if (!id) {
        return NextResponse.json({ error: "ID manquant." }, { status: 400 });
    }

    try {
        await prisma.lesson.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Erreur DELETE leçon :", error);
        return NextResponse.json({ error: "Erreur lors de la suppression." }, { status: 500 });
    }
}