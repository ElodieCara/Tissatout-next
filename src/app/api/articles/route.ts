import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { generateSlug } from "@/lib/utils";

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
export async function POST(req: Request) {
    try {
        const body = await req.json();
        console.log("📥 Données reçues :", body);

        if (!body.title || !body.content || !body.category || !body.author) {
            return NextResponse.json({ message: "❌ Titre, contenu, catégorie et auteur requis" }, { status: 400 });
        }

        const slug = generateSlug(body.title, crypto.randomUUID());

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
                    create: body.ageCategories.map((ageCategoryId: string) => ({
                        ageCategory: { connect: { id: ageCategoryId } },
                    })),
                },

                // ✅ Ajouter les sections avec style normalisé
                sections: {
                    create: Array.isArray(body.sections)
                        ? body.sections.map((section: any) => {
                            const rawStyle = section.style?.toLowerCase();
                            const style = ["highlight", "icon"].includes(rawStyle) ? rawStyle : "classique";

                            return {
                                title: section.title,
                                content: section.content,
                                style,
                            };
                        })
                        : [],
                },
            },
        });

        return NextResponse.json(newArticle, { status: 201 });
    } catch (error) {
        console.error("❌ Erreur lors de la création de l'article :", error);
        return NextResponse.json({ message: "Erreur serveur", error: (error as Error).message }, { status: 500 });
    }
}


