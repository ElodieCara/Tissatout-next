import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// 🟢 GET : Récupérer un conseil avec les catégories d'âge (en IDs simples)
export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params;

        if (!id) return NextResponse.json({ error: "❌ ID manquant." }, { status: 400 });

        const advice = await prisma.advice.findUnique({
            where: { id },
            include: {
                ageCategories: {
                    include: { ageCategory: true },
                },
            },
        });

        if (!advice) {
            return NextResponse.json({ error: "❌ Conseil introuvable" }, { status: 404 });
        }

        return NextResponse.json({
            ...advice,
            ageCategories: advice.ageCategories.map(ac => ac.ageCategoryId),
        });
    } catch (error) {
        console.error("❌ Erreur GET advice :", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}


// 🟡 Modifier un conseil
export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params;
        if (!id) return NextResponse.json({ error: "❌ ID manquant." }, { status: 400 });

        const body = await req.json();
        const { title, content, category, description, imageUrl, ageCategories = [] } = body;

        if (!title || !content || !category) {
            return NextResponse.json({ error: "❌ Champs obligatoires manquants." }, { status: 400 });
        }

        const ageCategoryIds = ageCategories
            .map((item: any) =>
                typeof item === "object" && item !== null && "id" in item ? item.id : item
            )
            .filter(Boolean);

        const updatedAdvice = await prisma.advice.update({
            where: { id },
            data: {
                title,
                content,
                category,
                description: description || null,
                imageUrl: imageUrl || null,
                ageCategories: {
                    deleteMany: {}, // 🔄 Réinitialiser les relations
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
            ...updatedAdvice,
            ageCategories: updatedAdvice.ageCategories.map(ac => ac.ageCategoryId),
        });
    } catch (error: any) {
        console.error("❌ Erreur PUT advice :", error.message, error.stack);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}


// 🔴 Supprimer un conseil
export async function DELETE(req: Request, context: any) {
    try {
        const id = await context.params.id; // ✅ Attendre l'accès aux params

        if (!id) {
            return NextResponse.json({ error: "❌ ID manquant." }, { status: 400 });
        }

        await prisma.advice.delete({
            where: { id },
        });

        return NextResponse.json({ message: "✅ Conseil supprimé avec succès !" });
    } catch (error) {
        console.error("❌ Erreur API DELETE Advice :", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}


