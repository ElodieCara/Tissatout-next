import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { withAdminGuard } from "@/lib/auth.guard";

export async function GET() {
    try {
        const data = await prisma.printableGame.findMany({
            include: {
                themes: { include: { theme: true } },
                types: { include: { type: true } },
            },
            orderBy: { createdAt: "desc" },
        });

        const cleaned = data.map(game => ({
            id: game.id,
            title: game.title,
            slug: game.slug,
            description: game.description,
            pdfUrl: game.pdfUrl,
            pdfPrice: game.pdfPrice,
            imageUrl: game.imageUrl,
            previewImageUrl: game.previewImageUrl,
            isPrintable: game.isPrintable,
            printPrice: game.printPrice,
            ageMin: game.ageMin,
            ageMax: game.ageMax,
            isFeatured: game.isFeatured,
            isMystery: game.isMystery,
            mysteryUntil: game.mysteryUntil,
            themes: game.themes.filter(t => t.theme !== null),
            types: game.types.filter(t => t.type !== null),
        }));

        return NextResponse.json(cleaned);
    } catch (error) {
        console.error("❌ Erreur GET /api/printable/admin :", error);
        return NextResponse.json({
            message: "Erreur serveur",
            error: (error as Error).message
        }, { status: 500 });
    }
}
