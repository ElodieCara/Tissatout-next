import prisma from "@/lib/prisma";
import path from "path";
import { unlink } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import { withAdminGuard } from "@/lib/auth.guard";

// 🟢 GET : Récupérer une idée avec ses catégories d'âge
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
                sections: {
                    include: {
                        coloring: true,  // ← Relations directes dans les sections
                        activity: true   // ← Relations directes dans les sections
                    }
                },
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
                relatedColorings: {
                    include: {
                        toColoring: true,
                    },
                },
                relatedActivities: {
                    include: {
                        toActivity: true,
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
            sections: idea.sections.map(section => ({
                ...section,
                // 🔥 AJOUT : Mapper les relations pour le frontend
                relatedColoringId: section.coloringId,
                relatedActivityId: section.activityId,
            })),
            relatedArticles: idea.relatedArticles.map((ra) => ra.toArticle),
            relatedColorings: idea.relatedColorings.map((rc) => rc.toColoring),
            relatedActivities: idea.relatedActivities.map((ra) => ra.toActivity),
        });
    } catch (error) {
        console.error("❌ Erreur GET idea :", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
// 🔄 PUT : Modifier une idée avec ses catégories d'âge
export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    return withAdminGuard(req, async (_req) => {
        try {
            const { id } = await context.params;
            const body = await req.json();
            const {
                title,
                description,
                image,
                theme,
                ageCategories,
                sections,
                relatedArticleIds,
                relatedColoringIds,
                relatedActivityIds
            } = body;

            console.log("📝 Données reçues pour mise à jour :", {
                articles: relatedArticleIds,
                coloriages: relatedColoringIds,
                activités: relatedActivityIds,
                sections: sections
            });

            if (!title || !theme) {
                return NextResponse.json({ error: "❌ Champs obligatoires manquants." }, { status: 400 });
            }

            const ageCategoryIds = Array.isArray(ageCategories)
                ? ageCategories.map((item: any) =>
                    typeof item === "object" && item !== null && "id" in item ? item.id : item
                ).filter(Boolean)
                : [];

            // 🧹 Supprimer TOUTES les anciennes relations d'un coup
            await Promise.all([
                // Supprimer les anciens articles liés
                prisma.relatedIdeaArticle.deleteMany({
                    where: { fromIdeaId: id }
                }),
                // Supprimer les anciens coloriages liés
                prisma.relatedIdeaColoring.deleteMany({
                    where: { fromIdeaId: id }
                }),
                // Supprimer les anciennes activités liées
                prisma.relatedIdeaActivity.deleteMany({
                    where: { fromIdeaId: id }
                })
            ]);

            // ➕ Créer les nouvelles relations en parallèle
            const relationPromises = [];

            // Articles liés
            if (Array.isArray(relatedArticleIds) && relatedArticleIds.length > 0) {
                relationPromises.push(
                    prisma.relatedIdeaArticle.createMany({
                        data: relatedArticleIds.map((articleId: string) => ({
                            fromIdeaId: id,
                            toArticleId: articleId,
                        }))
                    })
                );
            }

            // Coloriages liés
            if (Array.isArray(relatedColoringIds) && relatedColoringIds.length > 0) {
                relationPromises.push(
                    prisma.relatedIdeaColoring.createMany({
                        data: relatedColoringIds.map((drawingId: string) => ({
                            fromIdeaId: id,
                            toColoringId: drawingId,
                        }))
                    })
                );
            }

            // Activités liées
            if (Array.isArray(relatedActivityIds) && relatedActivityIds.length > 0) {
                relationPromises.push(
                    prisma.relatedIdeaActivity.createMany({
                        data: relatedActivityIds.map((activityId: string) => ({
                            fromIdeaId: id,
                            toActivityId: activityId,
                        }))
                    })
                );
            }

            // Exécuter toutes les créations en parallèle
            await Promise.all(relationPromises);

            // ✅ Mettre à jour l'idée AVEC les relations des sections
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
                        deleteMany: {},
                        create: sections.map((section: any) => ({
                            title: section.title,
                            content: section.content,
                            style: section.style || "classique",
                            imageUrl: section.imageUrl || null,
                            // 🔥 AJOUT : Relations directes dans les sections
                            coloringId: section.relatedColoringId || null,
                            activityId: section.relatedActivityId || null,
                        }))
                    }
                },
                include: {
                    ageCategories: {
                        include: { ageCategory: true },
                    },
                    sections: {
                        include: {
                            coloring: true,  // ← Inclure les coloriages liés
                            activity: true   // ← Inclure les activités liées
                        }
                    },
                    relatedArticles: {
                        include: { toArticle: true }
                    },
                    relatedColorings: {
                        include: { toColoring: true },
                    },
                    relatedActivities: {
                        include: { toActivity: true },
                    },
                },
            });

            return NextResponse.json({
                ...updatedIdea,
                ageCategories: updatedIdea.ageCategories.map((ac) => ac.ageCategoryId),
                sections: updatedIdea.sections,
                relatedArticles: updatedIdea.relatedArticles.map((ra) => ra.toArticle),
                relatedColorings: updatedIdea.relatedColorings.map((rc) => rc.toColoring),
                relatedActivities: updatedIdea.relatedActivities.map((ra) => ra.toActivity),
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

        // 🔗 2️⃣ Supprimer toutes les relations
        await Promise.all([
            prisma.relatedIdeaArticle.deleteMany({
                where: { fromIdeaId: id }
            }),
            prisma.relatedIdeaColoring.deleteMany({
                where: { fromIdeaId: id }
            }),
            prisma.relatedIdeaActivity.deleteMany({
                where: { fromIdeaId: id }
            })
        ]);

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