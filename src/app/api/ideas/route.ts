import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// 🎨 Correspondance FR → EN
const themeMapping: Record<string, string> = {
    "Hiver": "winter",
    "Printemps": "spring",
    "Été": "summer",
    "Automne": "autumn",
    "Halloween": "halloween",
    "Noël": "christmas"
};

// 🟢 Récupérer toutes les idées avec filtre par thème
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const themeFr = searchParams.get("theme"); // Thème reçu en FR

        if (!themeFr) {
            console.log("🔎 Aucun thème sélectionné, récupération de toutes les idées.");
        }

        // Convertit en EN si trouvé, sinon garde tel quel
        const themeEn = themeFr ? themeMapping[themeFr] || themeFr : null;

        console.log("🎨 Thème reçu (FR) :", themeFr);
        console.log("🌎 Thème utilisé en base (EN) :", themeEn);

        // 🔍 Filtrer uniquement si un thème est sélectionné
        const whereClause = themeEn ? { theme: themeEn } : {};

        const ideas = await prisma.idea.findMany({
            where: whereClause,
            orderBy: { createdAt: "desc" },
        });

        console.log("📤 Idées envoyées :", ideas);
        return NextResponse.json(ideas);
    } catch (error) {
        console.error("❌ Erreur API :", error);
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
