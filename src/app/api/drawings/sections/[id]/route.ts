import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";
import { withAdminGuard } from "@/lib/auth.guard";

const prisma = new PrismaClient();

// 🔍 Récupérer une section par ID
export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    const { id } = params;

    const section = await prisma.categorySection.findUnique({
        where: { id },
    });

    if (!section) {
        return NextResponse.json(
            { error: "Section introuvable" },
            { status: 404 }
        );
    }

    return NextResponse.json(section);
}

// ✏️ Modifier une section
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;
    return withAdminGuard(req, async (_req) => {
        try {
            const { id } = params;
            const body = await req.json();
            const { name, description, iconSrc } = body;

            // Mise à jour de la section
            const updatedSection = await prisma.categorySection.update({
                where: { id },
                data: {
                    name,
                    description,
                    iconSrc,
                },
            });

            return NextResponse.json(updatedSection);
        } catch (error) {
            console.error("Erreur PUT section:", error);
            return NextResponse.json(
                { error: "Erreur lors de la mise à jour" },
                { status: 500 }
            );
        }
    });
}

// 🗑️ Supprimer une section
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;
    return withAdminGuard(req, async (_req) => {
        try {
            const { id } = params;

            // Vérifier si la section contient des catégories associées
            const categories = await prisma.drawingCategory.findMany({
                where: { sectionId: id },
            });

            if (categories.length > 0) {
                return NextResponse.json(
                    { error: "Cette section contient des catégories, supprime-les d'abord." },
                    { status: 400 }
                );
            }

            await prisma.categorySection.delete({ where: { id } });

            return NextResponse.json({ message: "Section supprimée avec succès." });
        } catch (error) {
            console.error("Erreur DELETE section:", error);
            return NextResponse.json(
                { error: "Erreur lors de la suppression" },
                { status: 500 }
            );
        }
    });
}
