import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { withAdminGuard } from "@/lib/auth.guard";

const prisma = new PrismaClient();

/** 🔍 Récupérer une catégorie spécifique */
export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    const { id } = params;

    try {
        const category = await prisma.drawingCategory.findUnique({
            where: { id: id.toString() },
            include: {
                section: true, // 🔍 Inclure les détails de la section si existante
                parent: true,  // 🔍 Inclure la catégorie parent si existante
            }
        });

        if (!category) {
            return NextResponse.json({ error: "Catégorie introuvable" }, { status: 404 });
        }

        return NextResponse.json(category);
    } catch (error) {
        console.error("❌ Erreur GET catégorie:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

/** 📝 Mettre à jour une catégorie */
export async function PUT(req: NextRequest, context: { params: { id: string } }) {
    return withAdminGuard(req, async (_req) => {
        try {
            const { id } = context.params;
            const body = await req.json();
            const { name, sectionId, description, iconSrc, parentId } = body;

            console.log(`✏️ Mise à jour de la catégorie ${id} avec :`, body);

            // Vérifier si la section et la catégorie parent existent
            if (sectionId) {
                const sectionExists = await prisma.categorySection.findUnique({
                    where: { id: sectionId }
                });

                if (!sectionExists) {
                    return NextResponse.json({ error: "Section introuvable" }, { status: 400 });
                }
            }

            if (parentId) {
                const parentExists = await prisma.drawingCategory.findUnique({
                    where: { id: parentId }
                });

                if (!parentExists) {
                    return NextResponse.json({ error: "Catégorie parent introuvable" }, { status: 400 });
                }
            }

            // Mise à jour de la catégorie
            const updatedCategory = await prisma.drawingCategory.update({
                where: { id },
                data: {
                    name,
                    sectionId,
                    parentId,
                }
            });

            return NextResponse.json(updatedCategory);
        } catch (error) {
            console.error("❌ Erreur PUT catégorie:", error);
            return NextResponse.json({ error: "Erreur lors de la mise à jour" }, { status: 500 });
        }
    });
}

/** 🗑️ Supprimer une catégorie */
export async function DELETE(req: NextRequest, context: { params: { id: string } }) {
    const { id } = context.params;

    return withAdminGuard(req, async (_req) => {
        try {

            // Vérifier si la catégorie existe
            const category = await prisma.drawingCategory.findUnique({
                where: { id }
            });

            if (!category) {
                return NextResponse.json({ error: "Catégorie introuvable" }, { status: 404 });
            }

            await prisma.drawingCategory.delete({ where: { id } });

            return NextResponse.json({ message: "✅ Catégorie supprimée" });
        } catch (error) {
            console.error("❌ Erreur DELETE catégorie:", error);
            return NextResponse.json({ error: "Erreur lors de la suppression" }, { status: 500 });
        }
    });
}
