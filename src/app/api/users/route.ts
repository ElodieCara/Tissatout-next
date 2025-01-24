import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET : Récupère tous les articles
export async function GET() {
    try {
        const articles = await prisma.article.findMany();
        return NextResponse.json(articles, { status: 200 });
    } catch (error) {
        console.error("Erreur serveur :", error);
        return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
    }
}

// POST : Crée un nouvel article
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const newArticle = await prisma.article.create({ data: body });
        return NextResponse.json(newArticle, { status: 201 });
    } catch (error) {
        console.error("Erreur serveur :", error);
        return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
    }
}
