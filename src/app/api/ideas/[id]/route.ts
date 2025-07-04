import prisma from "@/lib/prisma";
import path from "path";
import { unlink } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import { withAdminGuard } from "@/lib/auth.guard";

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
                sections: true,
                relatedLinks: {
                    include: {
                        toIdea: true,
                    },
                },
                relatedArticles: {
                    include: {
                        toArticle: true,
                    },
                },
            },
        });

        if (!idea) {
            return NextResponse.json({ message: "❌ Idée non trouvée" }, { status: 404 });
        }

        return NextResponse.json({
            ...idea,
            ageCategories: idea.ageCategories.map((ac) => ac.ageCategoryId),
            sections: idea.sections || [],
            relatedArticles: idea.relatedArticles.map((ra) => ra.toArticle),
        });
    } catch (error) {
        console.error("❌ Erreur GET idea :", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

// 🔄 PUT : Modifier une idée avec ses catégories d’âge
export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    return withAdminGuard(req, async (_req) => {
        try {
            const { id } = await context.params;
            const body = await req.json();
            const { title, description, image, theme, ageCategories, sections, relatedArticleIds } = body;

            console.log("📝 Articles liés reçus pour mise à jour :", relatedArticleIds);

            if (!title || !theme) {
                return NextResponse.json({ error: "❌ Champs obligatoires manquants." }, { status: 400 });
            }

            const ageCategoryIds = Array.isArray(ageCategories)
                ? ageCategories.map((item: any) =>
                    typeof item === "object" && item !== null && "id" in item ? item.id : item
                ).filter(Boolean)
                : [];

            // 🔄 Vérification : Y a-t-il des articles liés à mettre à jour ?
            if (Array.isArray(relatedArticleIds) && relatedArticleIds.length > 0) {
                // ✅ Supprimer les anciennes relations
                await prisma.relatedIdeaArticle.deleteMany({
                    where: {
                        fromIdeaId: id
                    }
                });

                // ✅ Créer les nouvelles relations
                await prisma.relatedIdeaArticle.createMany({
                    data: relatedArticleIds.map((articleId: string) => ({
                        fromIdeaId: id,
                        toArticleId: articleId,
                    }))
                });
            }

            // ✅ Mettre à jour l'idée
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
                    sections: {
                        deleteMany: {}, // On supprime les anciennes sections
                        create: sections.map((section: any) => ({
                            title: section.title,
                            content: section.content,
                            style: section.style || "classique",
                            imageUrl: section.imageUrl || null,
                        }))
                    }
                },
                include: {
                    ageCategories: {
                        include: { ageCategory: true },
                    },
                    sections: true,
                    relatedArticles: {
                        include: { toArticle: true }
                    }
                },
            });

            return NextResponse.json({
                ...updatedIdea,
                ageCategories: updatedIdea.ageCategories.map((ac) => ac.ageCategoryId),
                sections: updatedIdea.sections,
                relatedArticles: updatedIdea.relatedArticles.map((ra) => ra.toArticle),
            });
        } catch (error) {
            console.error("❌ Erreur PUT idea :", error);
            return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
        }
    });
}


// 🔴 DELETE : Supprimer une idée
export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    return withAdminGuard(req, async (_req) => {
        const { id } = await context.params;

        if (!id) {
            return NextResponse.json({ error: "ID manquant" }, { status: 400 });
        }

        // 🔍 1️⃣ Récupérer l'idée pour vérifier l'image
        const idea = await prisma.idea.findUnique({
            where: { id },
            select: { image: true },
        });

        if (!idea) {
            return NextResponse.json({ error: "Idée introuvable" }, { status: 404 });
        }

        // 🔗 2️⃣ Supprimer les pivots vers Article
        await prisma.relatedIdeaArticle.deleteMany({
            where: {
                OR: [
                    { fromIdeaId: id },
                    { toArticleId: id }, // Si jamais tu as aussi une idée reliée en `toArticleId`
                ],
            },
        });

        // 🗑️ 3️⃣ Supprimer l'image si présente
        if (idea.image) {
            const fileName = idea.image.split("/uploads/")[1];
            if (fileName) {
                const filePath = path.join(process.cwd(), "public/uploads", fileName);
                try {
                    await unlink(filePath);
                } catch (err: any) {
                    if (err.code === "ENOENT") {
                        console.log("ℹ️ Fichier déjà absent :", fileName);
                    } else {
                        console.error("❌ Erreur unlink fichier :", err);
                    }
                }
            }
        }

        // ✅ 4️⃣ Supprimer l'idée
        await prisma.idea.delete({
            where: { id },
        });

        return NextResponse.json({ message: "✅ Idée et image supprimées avec succès" });
    });
}
