import { NextRequest, NextResponse } from "next/server";
import { withAdminGuard } from "@/lib/auth.guard";
import prisma from "@/lib/prisma";

// 🔧 Fonction utilitaire pour normaliser la mysteryUntil
function parseMysteryUntil(rawDate: string | null): Date | null {
    if (!rawDate) return null;

    const date = new Date(rawDate);
    if (isNaN(date.getTime())) return null;

    const hasTime = rawDate.includes("T");
    if (!hasTime && date.getUTCHours() === 0 && date.getUTCMinutes() === 0) {
        // Fixe à 06h UTC = 8h heure de Paris
        date.setUTCHours(6, 0, 0, 0);
    }
    return date;
}

export async function GET() {
    try {
        const printables = await prisma.printableGame.findMany({
            include: {
                themes: { include: { theme: true } },
                types: { include: { type: true } },
            },
            orderBy: { createdAt: "desc" },
        });

        const games = printables.map(game => ({
            ...game,
            themes: game.themes.filter(t => t.theme !== null),
            types: game.types.filter(t => t.type !== null),
            // on renvoie la date en ISO ou null
            mysteryUntil: game.mysteryUntil?.toISOString() || null,
        }));

        return NextResponse.json(games);
    } catch (error) {
        console.error("❌ Erreur GET /api/printable :", error);
        return NextResponse.json(
            { message: "Erreur serveur", error: (error as Error).message },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    return withAdminGuard(req, async (_req) => {
        const body = await req.json();

        // Si on coche isMystery, décocher l'ancien
        if (body.isMystery) {
            await prisma.printableGame.updateMany({
                where: { isMystery: true },
                data: { isMystery: false },
            });
        }

        const mysteryUntilDate = parseMysteryUntil(body.mysteryUntil ?? null);

        const game = await prisma.printableGame.create({
            data: {
                title: body.title,
                slug: body.slug,
                description: body.description,
                pdfUrl: body.pdfUrl,
                pdfPrice: body.pdfPrice ?? null,
                imageUrl: body.imageUrl,
                previewImageUrl: body.previewImageUrl ?? null,
                isPrintable: body.isPrintable,
                printPrice: body.printPrice ?? null,
                ageMin: body.ageMin,
                ageMax: body.ageMax,
                isFeatured: body.isFeatured,
                isMystery: body.isMystery ?? false,
                mysteryUntil: mysteryUntilDate,
                article: body.articleId
                    ? { connect: { id: body.articleId } }
                    : undefined,
            },
        });

        return NextResponse.json({ message: "Créé", game });
    });
}

export async function PUT(req: NextRequest, context: { params: { id: string } }) {
    return withAdminGuard(req, async (_req) => {
        const body = await req.json();

        // Si on coche isMystery, décocher l'ancien
        if (body.isMystery) {
            await prisma.printableGame.updateMany({
                where: { isMystery: true },
                data: { isMystery: false },
            });
        }

        // Normalisation : soit null (non-mystère ou date invalide), soit Date
        const mysteryUntilDate = body.isMystery
            ? parseMysteryUntil(body.mysteryUntil ?? null)
            : null;

        const game = await prisma.printableGame.update({
            where: { id: context.params.id },
            data: {
                title: body.title,
                slug: body.slug,
                description: body.description,
                pdfUrl: body.pdfUrl,
                pdfPrice: body.pdfPrice ?? null,
                imageUrl: body.imageUrl,
                previewImageUrl: body.previewImageUrl ?? null,
                isPrintable: body.isPrintable,
                printPrice: body.printPrice ?? null,
                ageMin: body.ageMin,
                ageMax: body.ageMax,
                isFeatured: body.isFeatured,
                isMystery: body.isMystery ?? false,
                mysteryUntil: mysteryUntilDate,
                article: body.articleId
                    ? { connect: { id: body.articleId } }
                    : { disconnect: true },
            },
        });

        return NextResponse.json({ message: "Mis à jour", game });
    });
}
