import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
    try {
        const sections = await prisma.categorySection.findMany({
            orderBy: { name: "asc" },
        });

        return NextResponse.json(sections);
    } catch (error) {
        console.error("❌ Erreur GET /sections:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
