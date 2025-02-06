import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// 🟢 Récupérer tous les articles (READ)
export async function GET() {
    try {
        const articles = await prisma.article.findMany();
        return NextResponse.json(articles);
    } catch (error) {
        console.error("Erreur lors de la récupération des articles :", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

// 🟢 Ajouter un nouvel article (CREATE)
export async function POST(req: Request) {
    try {
        const body = await req.json();
        console.log("📥 Données reçues :", body); // ✅ Vérifier ce qui est envoyé

        if (!body.title || !body.content) {
            return NextResponse.json({ message: "❌ Titre et contenu requis" }, { status: 400 });
        }

        // 📌 Conversion du champ "date" en `DateTime`
        const formattedDate = body.date ? new Date(body.date) : null;

        const newArticle = await prisma.article.create({
            data: {
                title: body.title,
                content: body.content,
                image: body.image || null,
                description: body.description || null,
                date: formattedDate, // ✅ Correction
            },
        });

        return NextResponse.json(newArticle, { status: 201 });
    } catch (error) {
        console.error("❌ Erreur lors de la création de l'article :", (error as Error).message);
        return NextResponse.json({ message: "Erreur serveur", error: (error as Error).message }, { status: 500 });
    }
}
