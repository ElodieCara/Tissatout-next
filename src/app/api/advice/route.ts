import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// 🛑 Fonction pour échapper les caractères dangereux (XSS protection)
function escapeHtml(text: string) {
    return text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// 🟢 Récupérer tous les conseils
export async function GET() {
    try {
        const advices = await prisma.advice.findMany({
            select: {
                id: true,
                title: true,
                content: true,
                description: true,
                category: true,
                createdAt: true,
                imageUrl: true,
            },
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json(advices);
    } catch (error) {
        console.error("❌ Erreur API (GET) :", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

// 🟢 Ajouter un nouveau conseil (depuis l'admin)
export async function POST(req: Request) {
    try {
        const body = await req.json();
        if (!body.title || !body.content || !body.category) {
            return NextResponse.json({ error: "❌ Champs obligatoires manquants" }, { status: 400 });
        }

        const newAdvice = await prisma.advice.create({
            data: {
                title: body.title,
                content: body.content,
                category: body.category,
                description: body.description,
                imageUrl: body.imageUrl || "", // ✅ Ajout de l'image
            },
        });

        return NextResponse.json(newAdvice, { status: 201 });
    } catch (error) {
        console.error("❌ Erreur API (POST) :", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
