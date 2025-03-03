import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb"; // ✅ Ajout d'ObjectId

const prisma = new PrismaClient();

// 🟢 Récupérer un coloriage par ID
export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        // ✅ Vérification de l'ID MongoDB
        if (!ObjectId.isValid(params.id)) {
            return NextResponse.json({ error: "ID invalide" }, { status: 400 });
        }

        const drawing = await prisma.drawing.findUnique({
            where: { id: params.id },
            include: { category: true },
        });

        if (!drawing) {
            return NextResponse.json({ error: "Coloriage non trouvé" }, { status: 404 });
        }

        return NextResponse.json(drawing);
    } catch (error) {
        console.error("❌ Erreur GET:", error);
        return NextResponse.json(
            { error: "Erreur serveur", details: (error as Error).message },
            { status: 500 }
        );
    }
}

// 🔄 Modifier un coloriage
export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const body = await req.json();
        const { title, imageUrl, categoryId } = body;

        // ✅ Vérification des champs requis
        if (!title || !imageUrl || !categoryId) {
            return NextResponse.json({ error: "Tous les champs sont requis" }, { status: 400 });
        }

        // ✅ Vérification des ID
        if (!ObjectId.isValid(params.id) || !ObjectId.isValid(categoryId)) {
            return NextResponse.json({ error: "Format d'ID invalide" }, { status: 400 });
        }

        // ✅ Vérifier si la catégorie existe
        const categoryExists = await prisma.drawingCategory.findUnique({
            where: { id: categoryId },
        });

        if (!categoryExists) {
            return NextResponse.json({ error: "Catégorie non trouvée" }, { status: 400 });
        }

        // ✅ Mettre à jour le coloriage
        const updatedDrawing = await prisma.drawing.update({
            where: { id: params.id },
            data: { title, imageUrl, categoryId },
        });

        return NextResponse.json(updatedDrawing);
    } catch (error) {
        console.error("❌ Erreur PUT:", error);
        return NextResponse.json(
            { error: "Erreur serveur", details: (error as Error).message },
            { status: 500 }
        );
    }
}

// ❌ Supprimer un coloriage
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        // ✅ Vérification de l'ID
        if (!ObjectId.isValid(params.id)) {
            return NextResponse.json({ error: "ID invalide" }, { status: 400 });
        }

        await prisma.drawing.delete({ where: { id: params.id } });
        return NextResponse.json({ message: "Coloriage supprimé" });
    } catch (error) {
        console.error("❌ Erreur DELETE:", error);
        return NextResponse.json(
            { error: "Erreur serveur", details: (error as Error).message },
            { status: 500 }
        );
    }
}
