import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// 🟢 Récupérer une idée par ID
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        if (!params.id) {
            return NextResponse.json({ error: "ID manquant" }, { status: 400 });
        }

        const idea = await prisma.idea.findUnique({
            where: { id: params.id },
        });

        if (!idea) {
            return NextResponse.json({ message: "❌ Idée non trouvée" }, { status: 404 });
        }

        return NextResponse.json(idea);
    } catch (error) {
        console.error("❌ Erreur Prisma :", error);
        return NextResponse.json({ error: "Erreur serveur", details: (error as Error).message }, { status: 500 });
    }
}

// 🔵 Modifier une idée par ID
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        if (!params.id) {
            return NextResponse.json({ error: "ID manquant" }, { status: 400 });
        }

        const body = await req.json();

        const updatedIdea = await prisma.idea.update({
            where: { id: params.id },
            data: {
                title: body.title,
                description: body.description,
                image: body.image || null,
                theme: body.theme,
            },
        });

        return NextResponse.json(updatedIdea);
    } catch (error) {
        console.error("❌ Erreur Prisma :", error);
        return NextResponse.json({ error: "Erreur serveur", details: (error as Error).message }, { status: 500 });
    }
}

// 🔴 Supprimer une idée par ID
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        if (!params.id) {
            return NextResponse.json({ error: "ID manquant" }, { status: 400 });
        }

        await prisma.idea.delete({
            where: { id: params.id },
        });

        return NextResponse.json({ message: "✅ Idée supprimée avec succès" });
    } catch (error) {
        console.error("❌ Erreur Prisma :", error);
        return NextResponse.json({ error: "Erreur serveur", details: (error as Error).message }, { status: 500 });
    }
}