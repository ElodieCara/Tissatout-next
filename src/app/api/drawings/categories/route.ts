import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

const prisma = new PrismaClient();

export async function GET() {
    try {
        console.log("🔍 Récupération des catégories...");

        const categories = await prisma.drawingCategory.findMany({
            orderBy: { name: "asc" }
        });

        console.log("✅ Catégories trouvées :", categories);

        return NextResponse.json(categories);
    } catch (error: unknown) {
        console.error("❌ Erreur API GET /categories :", error);

        // Vérifie si c'est bien une erreur avec un message
        const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";

        return NextResponse.json({ error: "Erreur serveur", details: errorMessage }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { name, section, description, iconSrc, parentId } = await req.json();

        if (!name) {
            return NextResponse.json({ error: "Le nom est requis" }, { status: 400 });
        }

        // 🔍 Vérifier si la section existe
        let sectionRecord = await prisma.categorySection.findFirst({
            where: { name: section }, // ✅ Utilise "section" au lieu de "sectionName"
        });

        // Si la section n'existe pas, on la crée
        if (!sectionRecord) {
            sectionRecord = await prisma.categorySection.create({
                data: { name: section }, // ✅ Corrigé
            });
        }

        // ✅ Création de la catégorie avec sectionId
        const newCategory = await prisma.drawingCategory.create({
            data: {
                name,
                sectionId: sectionRecord.id, // 🔥 Associe bien l'ID de la section
                parentId: parentId || null, // Peut être une sous-catégorie
            },
        });

        return NextResponse.json(newCategory, { status: 201 });

    } catch (error) {
        console.error("❌ Erreur POST /categories :", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id || !ObjectId.isValid(id)) {
            return NextResponse.json({ error: "ID invalide" }, { status: 400 });
        }

        // 🔍 Vérifier si la catégorie a des sous-catégories
        const subCategories = await prisma.drawingCategory.findMany({
            where: { parentId: id },
        });

        if (subCategories.length > 0) {
            return NextResponse.json({ error: "Impossible de supprimer : cette catégorie contient des sous-catégories." }, { status: 400 });
        }

        // ✅ Suppression de la catégorie
        await prisma.drawingCategory.delete({ where: { id } });
        return NextResponse.json({ message: "Catégorie supprimée" });

    } catch (error) {
        console.error("❌ Erreur DELETE /categories :", error);
        return NextResponse.json({ error: "Erreur lors de la suppression" }, { status: 500 });
    }
}
