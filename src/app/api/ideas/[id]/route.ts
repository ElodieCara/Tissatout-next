import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

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
}


// 🔴 DELETE : Supprimer une idée
export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params;

        if (!id) {
            return NextResponse.json({ error: "ID manquant" }, { status: 400 });
        }

        await prisma.idea.delete({
            where: { id },
        });

        return NextResponse.json({ message: "✅ Idée supprimée avec succès" });
    } catch (error) {
        console.error("❌ Erreur DELETE idea :", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
