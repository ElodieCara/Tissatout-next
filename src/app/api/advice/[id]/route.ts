import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// 🟢 Récupérer un conseil par ID
export async function GET(req: Request, context: { params: { id: string } }) {
    try {
        const { id } = context.params; // ✅ Attendre `params` avant utilisation

        if (!id) {
            return NextResponse.json({ error: "❌ ID du conseil manquant." }, { status: 400 });
        }

        const advice = await prisma.advice.findUnique({
            where: { id },
        });

        if (!advice) {
            return NextResponse.json({ error: "❌ Conseil introuvable" }, { status: 404 });
        }

        return NextResponse.json(advice);
    } catch (error) {
        console.error("❌ Erreur API GET Advice:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

// 🟡 Modifier un conseil
export async function PUT(req: Request, context: { params: { id: string } }) {
    try {
        const { id } = context.params; // ✅ Utilisation correcte de `params`

        if (!id) {
            return NextResponse.json({ error: "❌ ID du conseil manquant." }, { status: 400 });
        }

        const body = await req.json();
        console.log("📥 Payload reçu pour mise à jour :", body);

        // ✅ Vérification des champs obligatoires
        if (!body.title || !body.content || !body.category) {
            return NextResponse.json({ error: "❌ Champs obligatoires manquants." }, { status: 400 });
        }

        // ✅ Mise à jour sans modifier `id`
        const updatedAdvice = await prisma.advice.update({
            where: { id },
            data: {
                title: body.title,
                description: body.description || null, // Facultatif
                content: body.content,
                category: body.category,
                imageUrl: body.imageUrl || null, // Facultatif
            },
        });

        return NextResponse.json(updatedAdvice);
    } catch (error: any) {
        console.error("❌ Erreur API PUT Advice:", error.message, error.stack);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

// 🔴 Supprimer un conseil
export async function DELETE(req: Request, context: any) {
    try {
        const id = await context.params.id; // ✅ Attendre l'accès aux params

        if (!id) {
            return NextResponse.json({ error: "❌ ID manquant." }, { status: 400 });
        }

        await prisma.advice.delete({
            where: { id },
        });

        return NextResponse.json({ message: "✅ Conseil supprimé avec succès !" });
    } catch (error) {
        console.error("❌ Erreur API DELETE Advice :", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}


