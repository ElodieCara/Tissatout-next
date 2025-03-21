import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// 🟢 GET : Récupérer une idée avec ses catégories d’âge
export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params;

        if (!id) {
            return NextResponse.json({ error: "ID manquant" }, { status: 400 });
        }

        const idea = await prisma.idea.findUnique({
            where: { id },
            include: {
                ageCategories: {
                    include: { ageCategory: true },
                },
            },
        });

        if (!idea) {
            return NextResponse.json({ message: "❌ Idée non trouvée" }, { status: 404 });
        }

        return NextResponse.json({
            ...idea,
            ageCategories: idea.ageCategories.map((ac) => ac.ageCategoryId),
        });
    } catch (error) {
        console.error("❌ Erreur GET idea :", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

// 🔄 PUT : Modifier une idée avec ses catégories d’âge
export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params;
        const body = await req.json();
        const { title, description, image, theme, ageCategories } = body;

        if (!title || !theme) {
            return NextResponse.json({ error: "❌ Champs obligatoires manquants." }, { status: 400 });
        }

        const ageCategoryIds = Array.isArray(ageCategories)
            ? ageCategories.map((item: any) =>
                typeof item === "object" && item !== null && "id" in item ? item.id : item
            ).filter(Boolean)
            : [];

        const updatedIdea = await prisma.idea.update({
            where: { id },
            data: {
                title,
                description: description || null,
                image: image || null,
                theme,
                ageCategories: {
                    deleteMany: {},
                    create: ageCategoryIds.map((ageId: string) => ({
                        ageCategoryId: ageId,
                    })),
                },
            },
            include: {
                ageCategories: {
                    include: { ageCategory: true },
                },
            },
        });

        return NextResponse.json({
            ...updatedIdea,
            ageCategories: updatedIdea.ageCategories.map((ac) => ac.ageCategoryId),
        });
    } catch (error) {
        console.error("❌ Erreur PUT idea :", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

// 🔴 DELETE : Supprimer une idée
export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params;

        if (!id) {
            return NextResponse.json({ error: "ID manquant" }, { status: 400 });
        }

        await prisma.idea.delete({
            where: { id },
        });

        return NextResponse.json({ message: "✅ Idée supprimée avec succès" });
    } catch (error) {
        console.error("❌ Erreur DELETE idea :", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
