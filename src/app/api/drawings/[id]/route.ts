import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { withAdminGuard } from "@/lib/auth.guard";
import path from "path";
import { unlink } from "fs/promises";
import { ObjectId } from "mongodb";

const prisma = new PrismaClient();

// 🟢 Récupérer un coloriage
export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        if (!params.id) {
            return NextResponse.json({ error: "ID manquant" }, { status: 400 });
        }

        const drawing = await prisma.drawing.findUnique({
            where: { id: params.id },
            include: {
                category: true,
                ageCategories: {
                    include: { ageCategory: true }, // ✅ Récupération des catégories d'âge liées
                },
            },
        });

        if (!drawing) {
            return NextResponse.json({ error: "Coloriage non trouvé" }, { status: 404 });
        }

        return NextResponse.json({
            ...drawing,
            ageCategories: drawing.ageCategories.map((ac) => ac.ageCategoryId), // ✅ Transforme en tableau d'IDs
        });
    } catch (error) {
        console.error("❌ Erreur GET coloriage :", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

// 🟡 Mettre à jour un coloriage avec les catégories d'âge
export async function PUT(req: NextRequest, context: { params: { id: string } }) {
    return withAdminGuard(req, async (_req) => {
        try {
            const { id } = context.params; // ✅ Attendre `params.id`
            const body = await req.json();
            const { title, imageUrl, categoryId, ageCategories, slug } = body;

            if (!title || !imageUrl || !categoryId) {
                return NextResponse.json({ error: "❌ Titre, image et catégorie requis" }, { status: 400 });
            }

            // Extraire les IDs des catégories d'âge
            let ageCategoryIds: string[] = [];

            if (Array.isArray(ageCategories)) {
                ageCategoryIds = ageCategories.map(item => {
                    // Si c'est un objet avec une propriété id, extraire l'id
                    if (typeof item === 'object' && item !== null && 'id' in item) {
                        return item.id;
                    }
                    // Si c'est déjà une string, la retourner directement
                    return typeof item === 'string' ? item : null;
                }).filter(Boolean) as string[];
            }

            console.log("🔄 Mise à jour avec les catégories d'âge:", ageCategoryIds);

            // 🔄 Mise à jour du coloriage et des catégories d'âge
            const updatedDrawing = await prisma.drawing.update({
                where: { id },
                data: {
                    title,
                    imageUrl,
                    categoryId,
                    slug: slug || undefined,
                    ageCategories: {
                        deleteMany: {}, // Supprimer les anciens liens
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
                ...updatedDrawing,
                ageCategories: updatedDrawing.ageCategories.map((ac) => ac.ageCategoryId), // ✅ Retourner seulement les IDs
            });
        } catch (error) {
            console.error("❌ Erreur PUT coloriage :", error);
            return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
        }
    });
}

// 🔴 Supprimer un coloriage
export async function DELETE(req: NextRequest, context: { params: { id: string } }) {
    const { id } = context.params;

    return withAdminGuard(req, async (_req) => {
        try {
            if (!id) {
                return NextResponse.json({ error: "ID manquant" }, { status: 400 });
            }

            // 🟢 Chercher le coloriage pour connaître l'image
            const drawing = await prisma.drawing.findUnique({
                where: { id },
                select: { imageUrl: true },
            });

            if (!drawing) {
                return NextResponse.json({ error: "Coloriage introuvable" }, { status: 404 });
            }

            // 🟢 Supprimer l'image du disque si présente
            if (drawing.imageUrl) {
                const fileName = drawing.imageUrl.split("/uploads/")[1];
                if (fileName) {
                    const filePath = path.join(process.cwd(), "public/uploads", fileName);
                    try {
                        await unlink(filePath);
                        console.log(`✅ Image supprimée : ${fileName}`);
                    } catch (err: any) {
                        if (err.code === "ENOENT") {
                            console.log("🔍 Image déjà absente, rien à faire");
                        } else {
                            console.error("❌ Erreur suppression image :", err);
                        }
                    }
                }
            }

            // 🟢 Supprimer le coloriage en base
            await prisma.drawing.delete({ where: { id } });

            return NextResponse.json({ message: "✅ Coloriage et image supprimés" });
        } catch (error) {
            console.error("❌ Erreur DELETE coloriage :", error);
            return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
        }
    });
}
