import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: { slug: string } }) {
    try {
        const ageCategory = await prisma.ageCategory.findUnique({
            where: { slug: params.slug },
            include: {
                articles: true,
                drawings: true,
                advices: true,
                ideas: true
            }
        });

        if (!ageCategory) {
            return NextResponse.json({ error: "Tranche d'âge non trouvée" }, { status: 404 });
        }

        return NextResponse.json(ageCategory);
    } catch (error) {
        console.error("❌ Erreur lors de la récupération de l'âge :", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
