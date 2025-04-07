import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Assure-toi que c’est bien ton chemin

// 🔵 GET : Liste les commentaires approuvés pour un article donné
export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const articleId = searchParams.get("articleId");

    if (!articleId) {
        return NextResponse.json({ error: "articleId manquant" }, { status: 400 });
    }

    const comments = await prisma.comment.findMany({
        where: {
            articleId,
            approved: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return NextResponse.json(comments);
}

// 🟢 POST : Crée un commentaire (non approuvé par défaut)
export async function POST(req: NextRequest) {
    const body = await req.json();

    const { content, articleId } = body;

    if (!content || !articleId) {
        return NextResponse.json({ error: "Contenu ou articleId manquant" }, { status: 400 });
    }

    const newComment = await prisma.comment.create({
        data: {
            content,
            articleId,
            approved: false, // 🕵️ À modérer manuellement
        },
    });

    return NextResponse.json(newComment, { status: 201 });
}
