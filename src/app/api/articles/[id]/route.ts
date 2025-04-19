import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// 🟢 Récupérer un article par ID (avec sections)
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        if (!params || !params.id) {
            return NextResponse.json({ error: "ID manquant" }, { status: 400 });
        }

        const article = await prisma.article.findUnique({
            where: { id: params.id },
            include: {
                ageCategories: {
                    include: { ageCategory: true },
                },
                sections: {
                    orderBy: { id: 'asc' },
                },
                relatedLinks: {
                    include: {
                        toArticle: {
                            select: {
                                id: true,
                                title: true,
                                slug: true,
                            },
                        },
                    },
                },
                printableGame: {
                    select: {
                        id: true,
                        title: true,
                        slug: true,
                        pdfUrl: true,
                        pdfPrice: true,
                        imageUrl: true,
                        isPrintable: true,
                        printPrice: true,
                    },
                },
            },
        });

        if (!article) {
            return NextResponse.json({ message: "Article non trouvé" }, { status: 404 });
        }

        const printableGame = await prisma.printableGame.findFirst({
            where: { articleId: article.id },
            select: {
                id: true,
                title: true,
                slug: true,
                pdfUrl: true,
                pdfPrice: true,
                imageUrl: true,
                isPrintable: true,
                printPrice: true,
            },
        });

        // 🔁 Normaliser les sections pour garantir la structure
        const sections = article.sections.map(section => ({
            id: section.id,
            title: section.title,
            content: section.content,
            style: section.style || "classique",
        }));

        // 🔁 Transformer les articles liés pour le front
        const relatedArticles = article.relatedLinks.map(link => link.toArticle);

        // ✅ Réponse complète et propre
        return NextResponse.json({
            ...article,
            sections,
            relatedArticles,
            printableGame: article.printableGame,
        });

    } catch (error) {
        console.error("Erreur GET article admin :", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}


// 🟡 PUT: Mettre à jour un article
export async function PUT(req: NextRequest, context: { params: { id: string } }) {
    try {
        const { params } = context;
        const id = params?.id;

        if (!id) {
            return NextResponse.json({ message: "❌ ID manquant" }, { status: 400 });
        }

        const body = await req.json();
        const {
            title,
            content,
            category,
            author,
            image,
            iconSrc,
            tags,
            printableSupport,
            description,
            date,
            ageCategories,
            sections,
            relatedArticleIds
        } = body;

        if (!title || !content || !category || !author) {
            return NextResponse.json({ message: "❌ Titre, contenu, catégorie et auteur requis" }, { status: 400 });
        }

        const article = await prisma.article.findUnique({ where: { id } });
        if (!article) {
            return NextResponse.json({ message: "❌ Article non trouvé" }, { status: 404 });
        }

        // 🧹 Nettoyer les anciennes données
        await prisma.articleSection.deleteMany({ where: { articleId: id } });
        await prisma.relatedArticle.deleteMany({ where: { fromArticleId: id } });

        // 🧱 Recréer les sections
        if (Array.isArray(sections)) {
            for (const section of sections) {
                const rawStyle = section.style?.toLowerCase();
                const normalizedStyle = ["highlight", "icon"].includes(rawStyle) ? rawStyle : "classique";

                await prisma.articleSection.create({
                    data: {
                        title: section.title,
                        content: section.content,
                        style: normalizedStyle,
                        articleId: id,
                    },
                });
            }
        }

        // 🔗 Recréer les articles liés
        if (Array.isArray(relatedArticleIds) && relatedArticleIds.length > 0) {
            await prisma.relatedArticle.createMany({
                data: relatedArticleIds.map((toId: string) => ({
                    fromArticleId: id,
                    toArticleId: toId,
                })),
            });
        }

        // ✏️ Mettre à jour l’article
        const updatedArticle = await prisma.article.update({
            where: { id },
            data: {
                title,
                content,
                image: image || null,
                iconSrc: iconSrc || null,
                category,
                tags: tags || [],
                printableSupport: printableSupport || null,
                author,
                description: description || null,
                date: date ? new Date(date) : new Date(),
                ageCategories: {
                    deleteMany: {},
                    create: (ageCategories || []).map((ageCategoryId: string) => ({
                        ageCategory: { connect: { id: ageCategoryId } },
                    })),
                },
            },
        });

        console.log("✅ Article mis à jour :", updatedArticle.id);
        return NextResponse.json({ message: "Article mis à jour avec succès", updatedArticle });

    } catch (error) {
        console.error("❌ Erreur PUT article admin :", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}



// 🔴 DELETE: Supprimer un article
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        const article = await prisma.article.findUnique({ where: { id: params.id } });

        if (!article) {
            return NextResponse.json({ message: "❌ Article non trouvé" }, { status: 404 });
        }

        await prisma.article.delete({ where: { id: params.id } });

        return NextResponse.json({ message: "✅ Article supprimé avec succès" });
    } catch (error) {
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
