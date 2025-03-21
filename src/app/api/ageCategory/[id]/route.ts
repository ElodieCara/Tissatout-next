import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// 🟢 GET : récupérer une catégorie par ID
export async function GET(
    req: NextRequest,
    context: { params: { id: string } }
) {
    const { id } = context.params;

    try {
        const ageCategory = await prisma.ageCategory.findUnique({
            where: { id },
        });

        if (!ageCategory) {
            return NextResponse.json({ error: "Non trouvé" }, { status: 404 });
        }

        return NextResponse.json(ageCategory);
    } catch (error) {
        console.error("❌ Erreur GET AgeCategory :", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

// 🟡 PUT : modifier une catégorie
export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const body = await req.json();

        const updated = await prisma.ageCategory.update({
            where: { id: params.id },
            data: {
                title: body.title,
                slug: body.slug,
                description: body.description,
                imageCard: body.imageCard,
                imageBanner: body.imageBanner,
            },
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error("❌ Erreur PUT AgeCategory :", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

// 🔴 DELETE : supprimer une catégorie
export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await prisma.ageCategory.delete({
            where: { id: params.id },
        });

        return NextResponse.json({ message: "✅ Supprimé avec succès" });
    } catch (error) {
        console.error("❌ Erreur DELETE AgeCategory :", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
