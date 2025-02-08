import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// 🟢 Récupérer un article par ID
export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const article = await prisma.article.findUnique({
            where: { id: params.id },
        });

        if (!article) {
            return NextResponse.json({ message: "Article non trouvé" }, { status: 404 });
        }

        return NextResponse.json(article);
    } catch (error) {
        console.error("Erreur lors de la récupération de l'article :", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

// 🟡 Mettre à jour un article
export async function PUT(req: Request) {
    try {
        const url = new URL(req.url);
        const id = url.pathname.split("/").pop(); // ✅ Récupération correcte de l'ID

        if (!id) {
            return NextResponse.json({ message: "❌ ID requis" }, { status: 400 });
        }

        const body = await req.json();
        console.log("📥 Données reçues pour mise à jour :", body, "ID :", id);

        if (!body.title || !body.content || !body.category || !body.author) {
            return NextResponse.json({ message: "❌ Titre, contenu, catégorie et auteur requis" }, { status: 400 });
        }

        const updatedArticle = await prisma.article.update({
            where: { id },
            data: {
                title: body.title,
                content: body.content,
                image: body.image || null,
                iconSrc: body.iconSrc || null,
                category: body.category,
                tags: body.tags || [],
                author: body.author,
                description: body.description || null,
                date: body.date ? new Date(body.date) : null,
            },
        });

        return NextResponse.json(updatedArticle);
    } catch (error) {
        console.error("❌ Erreur lors de la mise à jour de l'article :", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}


// 🔴 Supprimer un article
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        await prisma.article.delete({
            where: { id: params.id },
        });

        return NextResponse.json({ message: "Article supprimé avec succès" });
    } catch (error) {
        console.error("Erreur lors de la suppression de l'article :", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

