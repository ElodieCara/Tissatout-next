import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { generateSlug } from "@/lib/utils";
import { withAdminGuard } from "@/lib/auth.guard";

// 🟢 Récupérer tous les articles (READ)
export async function GET() {
    try {
        const articles = await prisma.article.findMany({
            orderBy: { date: "desc" },
            include: {
                ageCategories: {
                    include: { ageCategory: true },
                },
            },
        });

        return NextResponse.json(articles);
    } catch (error) {
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

// 🟢 Ajouter un nouvel article (CREATE)
export async function POST(req: NextRequest) {
    return withAdminGuard(req, async () => {
        const body = await req.json();
        // … tes validations …

        const slug = generateSlug(body.title, crypto.randomUUID());

        // 1️⃣ CREATE article **sans** printableGame dans data
        const newArticle = await prisma.article.create({
            data: {
                title: body.title,
                slug,
                content: body.content,
                image: body.image || null,
                iconSrc: body.iconSrc || "/icons/default.png",
                category: body.category,
                tags: body.tags || [],
                author: body.author,
                description: body.description || null,
                date: body.date ? new Date(body.date) : new Date(),
                ageCategories: {
                    create: (body.ageCategories || []).map((ageId: string) => ({
                        ageCategory: { connect: { id: ageId } },
                    })),
                },
                sections: {
                    create: (body.sections || []).map((sec: any) => ({
                        title: sec.title,
                        content: sec.content,
                        style: ["highlight", "icon"].includes(sec.style) ? sec.style : "classique",
                    })),
                },
            },
        });

        // 2️⃣ Liaison du jeu imprimable **après** la création
        if (body.printableGameId) {
            // On délie d'abord tout ancien
            await prisma.printableGame.updateMany({
                where: { articleId: newArticle.id },
                data: { articleId: null },
            });
            // Puis on relie
            await prisma.printableGame.update({
                where: { id: body.printableGameId },
                data: { articleId: newArticle.id },
            });
        }

        // 3️⃣ Création des “articles liés”
        if (Array.isArray(body.relatedArticleIds) && body.relatedArticleIds.length) {
            await prisma.relatedArticle.createMany({
                data: (body.relatedArticleIds as string[]).map((toId: string) => ({
                    fromArticleId: newArticle.id,
                    toArticleId: toId,
                })),
            });
        }

        return NextResponse.json(newArticle, { status: 201 });
    });
}



