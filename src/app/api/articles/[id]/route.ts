import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// 🟢 Récupérer un article par ID
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        if (!params || !params.id) {
            console.error("❌ Aucun paramètre ID reçu !");
            return NextResponse.json({ error: "ID manquant" }, { status: 400 });
        }

        const id = params.id; // ✅ Extraire `id` proprement
        console.log("🔍 Recherche de l'article avec ID :", id);

        if (id.length !== 24) {
            console.error("❌ ID invalide :", id);
            return NextResponse.json({ error: "ID invalide" }, { status: 400 });
        }

        const article = await prisma.article.findUnique({ where: { id } });

        if (!article) {
            console.error("❌ Article non trouvé pour l'ID :", id);
            return NextResponse.json({ message: "Article non trouvé" }, { status: 404 });
        }

        return NextResponse.json(article);
    } catch (error) {
        console.error("❌ Erreur serveur :", error);
        return NextResponse.json({ error: "Erreur serveur", details: (error as Error).message }, { status: 500 });
    }
}

// 🟡 Mettre à jour un article via ID
export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const body = await req.json();
        console.log("📥 Données reçues pour mise à jour :", body, "ID :", params.id);

        if (!body.title || !body.content || !body.category || !body.author) {
            return NextResponse.json({ message: "❌ Titre, contenu, catégorie et auteur requis" }, { status: 400 });
        }

        // Vérifier si l'article existe avec l'ID
        const article = await prisma.article.findUnique({
            where: { id: params.id },
        });

        if (!article) {
            return NextResponse.json({ message: "❌ Article non trouvé" }, { status: 404 });
        }

        // Mettre à jour l'article
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
            },
        });

        return NextResponse.json(updatedArticle);
    } catch (error) {
        console.error("❌ Erreur lors de la mise à jour de l'article :", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

// 🔴 Supprimer un article par ID
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        // Vérifier si l'article existe avec l'ID
        const article = await prisma.article.findUnique({
            where: { id: params.id },
        });

        if (!article) {
            return NextResponse.json({ message: "❌ Article non trouvé" }, { status: 404 });
        }

        // Supprimer l'article
        await prisma.article.delete({
            where: { id: params.id },
        });

        return NextResponse.json({ message: "✅ Article supprimé avec succès" });
    } catch (error) {
        console.error("❌ Erreur lors de la suppression de l'article :", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}