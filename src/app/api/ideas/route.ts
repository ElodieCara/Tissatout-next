import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// 🎨 Correspondance FR → EN
const themeMapping: Record<string, string> = {
    "Hiver": "winter",
    "Printemps": "spring",
    "Été": "summer",
    "Automne": "autumn",
    "Halloween": "halloween",
    "Noël": "christmas",
    "Pâques": "easter" // Ajout de Pâques si jamais tu l'utilises
};


// 🟢 Récupérer toutes les idées ou filtrer par thème
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const themeFr = searchParams.get("theme")?.trim() || null; // 🔍 Suppression des espaces vides

        // Convertit en EN si trouvé, sinon garde le FR
        const themeEn = themeFr && themeMapping[themeFr] ? themeMapping[themeFr] : themeFr;

        console.log("🎨 Thème reçu (FR) :", themeFr);
        console.log("🌎 Thème utilisé en base (EN) :", themeEn || "Tous thèmes");

        // Si aucun thème n'est sélectionné, récupérer TOUTES les idées
        const whereClause = themeEn ? { theme: themeEn } : undefined;

        const ideas = await prisma.idea.findMany({
            where: whereClause,
            orderBy: { createdAt: "desc" },
        });

        console.log(`📤 ${ideas.length} idée(s) envoyée(s)`);
        return NextResponse.json(ideas);
    } catch (error) {
        console.error("❌ Erreur API GET /api/ideas :", error);
        return NextResponse.json({ error: "Erreur serveur", details: (error as Error).message }, { status: 500 });
    }
}

// 🟢 Ajouter une nouvelle idée (CREATE)
export async function POST(req: Request) {
    try {
        const body = await req.json();
        console.log("📥 Requête reçue :", body); // ✅ Vérifie les données reçues

        // ✅ Vérification des champs obligatoires
        if (!body.title?.trim() || !body.description?.trim() || !body.theme?.trim()) {
            return NextResponse.json({ error: "❌ Tous les champs (title, description, theme) sont requis." }, { status: 400 });
        }

        // ✅ Vérifier si le thème est valide (convertir en anglais si besoin)
        const themeEn = themeMapping[body.theme] || body.theme;

        // ✅ Création de la nouvelle idée
        const newIdea = await prisma.idea.create({
            data: {
                title: body.title.trim(),
                description: body.description.trim(),
                image: body.image?.trim() || null, // Image optionnelle
                theme: themeEn, // Thème obligatoire
            },
        });

        console.log("✅ Idée ajoutée avec succès :", newIdea);
        return NextResponse.json(newIdea, { status: 201 });

    } catch (error) {
        console.error("❌ Erreur API POST /api/ideas :", error);
        return NextResponse.json({ error: "Erreur serveur", details: (error as Error).message }, { status: 500 });
    }
}
