import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { ObjectId } from "mongodb";

const prisma = new PrismaClient();

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    const { id } = params;

    // Vérifier ID
    if (!ObjectId.isValid(id)) {
        return NextResponse.json({ error: "ID invalide" }, { status: 400 });
    }

    const category = await prisma.drawingCategory.findUnique({
        where: { id },
    });

    if (!category) {
        return NextResponse.json(
            { error: "Catégorie introuvable" },
            { status: 404 }
        );
    }

    return NextResponse.json(category);
}

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        if (!ObjectId.isValid(id)) {
            return NextResponse.json({ error: "ID invalide" }, { status: 400 });
        }

        const body = await request.json();
        const { name, section, description, iconSrc, parentId } = body;

        // Vérifier si on veut accrocher à un parent
        let validParentId: string | null = null;
        if (parentId) {
            if (!ObjectId.isValid(parentId)) {
                return NextResponse.json({ error: "parentId invalide" }, { status: 400 });
            }
            // Vérifier que la catégorie parent existe
            const parentCat = await prisma.drawingCategory.findUnique({
                where: { id: parentId },
            });
            if (!parentCat) {
                return NextResponse.json({ error: "Catégorie parent introuvable" }, { status: 400 });
            }
            validParentId = parentId;
        }

        // Mise à jour
        const updatedCat = await prisma.drawingCategory.update({
            where: { id },
            data: {
                name,
                section,
                parentId: validParentId,
            },
        });

        return NextResponse.json(updatedCat);
    } catch (error) {
        console.error("Erreur PUT catégorie:", error);
        return NextResponse.json({ error: "Erreur lors de la mise à jour" }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        if (!ObjectId.isValid(id)) {
            return NextResponse.json({ error: "ID invalide" }, { status: 400 });
        }

        await prisma.drawingCategory.delete({ where: { id } });

        return NextResponse.json({ message: "Catégorie supprimée" });
    } catch (error) {
        console.error("Erreur DELETE catégorie:", error);
        return NextResponse.json({ error: "Erreur lors de la suppression" }, { status: 500 });
    }
}
