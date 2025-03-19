import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { generateSlug } from "@/lib/utils";

// 🟢 Récupérer tous les articles (READ)
export async function GET() {
    try {
        const articles = await prisma.article.findMany({
            orderBy: {
                date: "desc", // Tri par date décroissante (le plus récent en premier)
            },
        });

        console.log("📤 Articles envoyés :", articles);

        // ✅ Formater la date avant d'envoyer les articles
        const formattedArticles = articles.map(article => ({
            ...article,
            date: article.date
                ? new Date(article.date).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                })
                : "Date inconnue",
        }));

        return NextResponse.json(formattedArticles);
    } catch (error) {
        console.error("❌ Erreur lors de la récupération des articles :", error);
        return NextResponse.json({ error: "Erreur serveur", details: (error as Error).message }, { status: 500 });
    }
}

// 🟢 Ajouter un nouvel article (CREATE)
export async function POST(req: Request) {
    try {
        const body = await req.json();
        console.log("📥 Données reçues :", body);

        // ✅ Vérifier si `body` est un tableau ou un objet unique
        const articles = Array.isArray(body) ? body : [body];

        // ✅ Vérifier que chaque article a bien `title`, `content`, `category`, `author`
        for (const article of articles) {
            if (!article.title || !article.content || !article.category || !article.author) {
                return NextResponse.json({ message: "❌ Titre, contenu, catégorie et auteur requis" }, { status: 400 });
            }
        }

        // ✅ Insérer plusieurs articles avec génération automatique du slug
        const newArticles = await prisma.$transaction(
            articles.map(article => {
                const slug = generateSlug(article.title, crypto.randomUUID()); // ✅ Génère un slug unique
                return prisma.article.create({
                    data: {
                        title: article.title,
                        slug, // ✅ Ajout du slug généré
                        content: article.content,
                        image: article.image || null,
                        iconSrc: article.iconSrc || "/icons/default.png",
                        category: article.category,
                        tags: article.tags || [],
                        author: article.author, // Vérifie que c'est bien un `authorId` attendu
                        description: article.description || null,
                        date: article.date ? new Date(article.date) : new Date(), // ✅ Ajoute une date par défaut
                    },
                });
            })
        );

        return NextResponse.json({ message: "✅ Articles créés", count: newArticles.length }, { status: 201 });
    } catch (error) {
        console.error("❌ Erreur lors de la création des articles :", error);
        return NextResponse.json({ message: "Erreur serveur", error: (error as Error).message }, { status: 500 });
    }
}
