import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const ageCategories = await prisma.ageCategory.findMany();
        return NextResponse.json(ageCategories);
    } catch (error) {
        console.error("❌ Erreur lors de la récupération des catégories d'âge :", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
