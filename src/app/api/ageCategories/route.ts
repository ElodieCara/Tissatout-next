import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { withAdminGuard } from "@/lib/auth.guard";

export async function GET() {
    try {
        const ageCategories = await prisma.ageCategory.findMany();
        return NextResponse.json(ageCategories);
    } catch (error) {
        console.error("❌ Erreur lors de la récupération des catégories d'âge :", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

// ✅ POST : Créer une nouvelle catégorie d’âge
export async function POST(req: NextRequest) {
    return withAdminGuard(req, async (_req) => {
        try {
            const body = await req.json();

            const newCategory = await prisma.ageCategory.create({
                data: {
                    title: body.title,
                    slug: body.slug,
                    description: body.description,
                    imageCard: body.imageCard,
                    imageBanner: body.imageBanner,
                },
            });

            return NextResponse.json(newCategory, { status: 201 });
        } catch (error) {
            console.error("❌ Erreur POST AgeCategory :", error);
            return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
        }
    });
}