import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// 🟢 Récupérer toutes les idées (READ)
export async function GET() {
    try {
        const ideas = await prisma.idea.findMany({
            orderBy: {
                createdAt: "desc", // Tri par date de création décroissante
            },
        });

        console.log("📤 Idées envoyées :", ideas); // ✅ Vérifier la réponse Prisma

        if (!ideas || !Array.isArray(ideas)) {
            console.error("⚠️ Prisma a retourné une valeur incorrecte :", ideas);
            return NextResponse.json({ error: "Aucune idée trouvée", data: [] }, { status: 200 });
        }

        return NextResponse.json(ideas);
    } catch (error) {
        console.error("❌ Erreur lors de la récupération des idées :", error);
        return NextResponse.json({ error: "Erreur serveur", details: (error as Error).message }, { status: 500 });
    }
}

// 🟢 Ajouter une nouvelle idée (CREATE)
export async function POST(req: Request) {
    try {
        const body = await req.json();
        console.log("📥 Requête reçue :", body); // ✅ Vérifie les données reçues

        if (!body.title || !body.description || !body.theme) {
            return NextResponse.json({ error: "❌ Champs manquants" }, { status: 400 });
        }

        const newIdea = await prisma.idea.create({
            data: {
                title: body.title,
                description: body.description,
                image: body.image || null, // Image optionnelle
                theme: body.theme, // Thème obligatoire
            },
        });

        console.log("✅ Idée ajoutée :", newIdea);
        return NextResponse.json(newIdea, { status: 201 });

    } catch (error) {
        console.error("❌ Erreur API :", error);
        return NextResponse.json({ error: "Erreur serveur", details: (error as Error).message }, { status: 500 });
    }
}
