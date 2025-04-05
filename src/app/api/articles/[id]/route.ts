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
                    orderBy: { id: 'asc' }, // pour garder l’ordre d’ajout
                },
            },
        });

        if (!article) {
            return NextResponse.json({ message: "Article non trouvé" }, { status: 404 });
        }

        return NextResponse.json(article);
    } catch (error) {
        console.error("Erreur GET article admin :", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}


// 🟡 PUT: Mettre à jour un article
export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const body = await req.json();

        if (!body.title || !body.content || !body.category || !body.author) {
            return NextResponse.json({ message: "❌ Titre, contenu, catégorie et auteur requis" }, { status: 400 });
        }

        const article = await prisma.article.findUnique({ where: { id: params.id } });
        if (!article) {
            return NextResponse.json({ message: "❌ Article non trouvé" }, { status: 404 });
        }

        // 🔄 Supprimer les anciennes sections
        await prisma.articleSection.deleteMany({ where: { articleId: params.id } });

        // ➕ Recréer les sections à partir du body
        if (Array.isArray(body.sections)) {
            await prisma.articleSection.createMany({
                data: body.sections.map((section: any) => ({
                    title: section.title,
                    content: section.content,
                    articleId: params.id,
                })),
            });
        }

        // 🔄 Mettre à jour l'article principal
        const updatedArticle = await prisma.article.update({
            where: { id: params.id },
            data: {
                title: body.title,
                content: body.content,
                image: body.image || null,
                iconSrc: body.iconSrc || null,
                category: body.category,
                tags: body.tags || [],
                author: body.author,
                description: body.description || null,
                date: body.date ? new Date(body.date) : new Date(),
                ageCategories: {
                    deleteMany: {},
                    create: body.ageCategories.map((ageCategoryId: string) => ({
                        ageCategory: { connect: { id: ageCategoryId } },
                    })),
                },
                sections: {
                    deleteMany: {},
                    create: body.sections.map((section: any) => ({
                        title: section.title,
                        content: section.content,
                    })),
                },
            },
        });

        return NextResponse.json(updatedArticle);
    } catch (error) {
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
