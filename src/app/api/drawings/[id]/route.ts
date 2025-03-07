import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

const prisma = new PrismaClient();

// Récupérer un coloriage
export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params; // ✅ OBLIGATOIRE

        if (!ObjectId.isValid(id)) {
            return NextResponse.json({ error: "ID invalide" }, { status: 400 });
        }

        const drawing = await prisma.drawing.findUnique({
            where: { id },
            include: { category: true },
        });

        if (!drawing) {
            return NextResponse.json({ error: "Coloriage non trouvé" }, { status: 404 });
        }

        return NextResponse.json(drawing);
    } catch (error) {
        console.error("❌ Erreur GET:", error);
        return NextResponse.json(
            { error: "Erreur interne du serveur" },
            { status: 500 }
        );
    }
}

// Modifier un coloriage
export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params; // ✅ OBLIGATOIRE
        const { title, imageUrl, categoryId } = await req.json();

        if (!title || !imageUrl || !categoryId) {
            return NextResponse.json({ error: "Tous les champs sont requis" }, { status: 400 });
        }

        if (!ObjectId.isValid(id) || !ObjectId.isValid(categoryId)) {
            return NextResponse.json({ error: "Format d'ID invalide" }, { status: 400 });
        }

        const updatedDrawing = await prisma.drawing.update({
            where: { id },
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

// Supprimer un coloriage
export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params; // ✅ OBLIGATOIRE

        if (!ObjectId.isValid(id)) {
            return NextResponse.json({ error: "ID invalide" }, { status: 400 });
        }

        await prisma.drawing.delete({ where: { id } });
        return NextResponse.json({ message: "Coloriage supprimé" });
    } catch (error) {
        console.error("❌ Erreur DELETE:", error);
        return NextResponse.json(
            { error: "Erreur serveur", details: (error as Error).message },
            { status: 500 }
        );
    }
}
