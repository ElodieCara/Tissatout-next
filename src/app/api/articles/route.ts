import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// 🟢 Récupérer tous les articles (READ)
export async function GET() {
    try {
        const articles = await prisma.article.findMany();
        console.log("📤 Articles envoyés :", articles); // ✅ Vérifier la réponse Prisma

        if (!articles || !Array.isArray(articles)) {
            console.error("⚠️ Prisma a retourné une valeur incorrecte :", articles);
            return NextResponse.json({ error: "Aucun article trouvé", data: [] }, { status: 200 });
        }

        return NextResponse.json(articles);
    } catch (error) {
        console.error("❌ Erreur lors de la récupération des articles :", error);
        return NextResponse.json({ error: "Erreur serveur", details: (error as Error).message }, { status: 500 });
    }
}

// 🟢 Ajouter un nouvel article (CREATE)
export async function POST(req: Request) {
    try {
        const body = await req.json();
        console.log("📥 Données reçues :", body); // ✅ Vérifier la requête

        // ✅ Vérifier si `body` est un tableau ou un objet unique
        const articles = Array.isArray(body) ? body : [body];

        // ✅ Vérifier que chaque article a bien `title`, `content`, `category`, `author`
        for (const article of articles) {
            if (!article.title || !article.content || !article.category || !article.author) {
                return NextResponse.json({ message: "❌ Titre, contenu, catégorie et auteur requis" }, { status: 400 });
            }
        }

        // ✅ Insérer plusieurs articles en une seule requête avec `createMany`
        const newArticles = await prisma.article.createMany({
            data: articles.map(article => ({
                title: article.title,
                content: article.content,
                image: article.image || null,
                iconSrc: article.iconSrc || "/icons/default.png", // ✅ Garde l'icône
                category: article.category,
                tags: article.tags || [],
                author: article.author,
                description: article.description || null,
                date: article.date ? new Date(article.date) : null, // ✅ Format `DateTime` corrigé
            })),
        });

        return NextResponse.json({ message: "✅ Articles créés", count: newArticles.count }, { status: 201 });
    } catch (error) {
        console.error("❌ Erreur lors de la création des articles :", error);
        return NextResponse.json({ message: "Erreur serveur", error: (error as Error).message }, { status: 500 });
    }
}

