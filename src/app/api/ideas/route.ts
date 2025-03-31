import prisma from "@/lib/prisma";
import { generateSlug } from "@/lib/utils";
import { NextResponse } from "next/server";

// 🎨 Correspondance FR → EN
const themeMapping: Record<string, string> = {
    "Hiver": "winter",
    "Printemps": "spring",
    "Été": "summer",
    "Automne": "autumn",
    "Halloween": "halloween",
    "Noël": "christmas",
    "Pâques": "easter"
};

export async function GET() {
    try {
        const ideas = await prisma.idea.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                ageCategories: {
                    include: { ageCategory: true },
                },
            },
        });

        return NextResponse.json(ideas);
    } catch (error) {
        console.error("❌ Erreur GET /api/ideas :", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}


// ✅ Ajouter une nouvelle idée AVEC liaison à une ou plusieurs catégories d'âge via ID
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { title, description, theme, image, ageCategoryIds } = body;

        if (!title?.trim() || !description?.trim() || !theme?.trim() || !Array.isArray(ageCategoryIds) || ageCategoryIds.length === 0) {
            return NextResponse.json(
                { error: "Champs requis manquants ou invalides." },
                { status: 400 }
            );
        }

        const themeEn = themeMapping[theme.trim()] || theme.trim();
        const slug = generateSlug(title);

        const newIdea = await prisma.idea.create({
            data: {
                title: title.trim(),
                slug,
                description: description.trim(),
                theme: themeEn,
                image: image?.trim() || null,
                ageCategories: {
                    create: ageCategoryIds.map((ageId: string) => ({
                        ageCategory: { connect: { id: ageId } }
                    }))
                }
            },
            include: {
                ageCategories: {
                    include: { ageCategory: true }
                }
            }
        });

        return NextResponse.json(newIdea, { status: 201 });
    } catch (error) {
        console.error("❌ Erreur POST /api/ideas :", error);
        return NextResponse.json(
            { error: "Erreur serveur", details: (error as Error).message },
            { status: 500 }
        );
    }
}
