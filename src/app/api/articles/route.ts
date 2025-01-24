import prisma from "@/lib/prisma"; // Pas de `{ prisma }`
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const articles = await prisma.article.findMany();
        return NextResponse.json(articles);
    } catch (error) {
        console.error("Erreur lors de la récupération des articles :", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const newArticle = await prisma.article.create({ data: body });
        return NextResponse.json(newArticle);
    } catch (error) {
        console.error("Erreur lors de la création d'un article :", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
