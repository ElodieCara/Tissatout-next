import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { withAdminGuard } from "@/lib/auth.guard";

// 🔧 Fonction utilitaire pour normaliser la mysteryUntil
function parseMysteryUntil(rawDate: string | null | undefined): Date | null {
    if (!rawDate) return null;
    const date = new Date(rawDate);
    if (isNaN(date.getTime())) return null;
    // Si pas d'heure précisée, fixer à 08h00 Paris
    const hasTime = rawDate.includes("T");
    if (!hasTime && date.getUTCHours() === 0 && date.getUTCMinutes() === 0) {
        date.setUTCHours(6, 0, 0, 0);
    }
    return date;
}

// GET d'une activité unique
export async function GET(_req: Request, { params }: { params: { id: string } }) {
    try {
        const game = await prisma.printableGame.findUnique({
            where: { id: params.id },
            include: {
                themes: { include: { theme: true } },
                types: { include: { type: true } },
                extraImages: true,
            },
        });

        if (!game) {
            return NextResponse.json({ message: "Not found" }, { status: 404 });
        }

        return NextResponse.json({
            ...game,
            isMystery: game.isMystery,
            mysteryUntil: game.mysteryUntil?.toISOString() || null,
            themeIds: game.themes.map(t => t.theme?.id).filter(Boolean),
            typeIds: game.types.map(t => t.type?.id).filter(Boolean),
            extraImages: game.extraImages.map(img => img.imageUrl),
        });
    } catch (error) {
        console.error("❌ Erreur GET /api/printable/[id] :", error);
        return NextResponse.json(
            { message: "Erreur serveur", error: (error as Error).message },
            { status: 500 }
        );
    }
}

// PUT pour mettre à jour une activité
export async function PUT(req: NextRequest, context: { params: { id: string } }) {
    return withAdminGuard(req, async (_req) => {
        const body = await req.json();

        // Décocher l'ancienne mystère si on coche isMystery
        if (body.isMystery) {
            await prisma.printableGame.updateMany({
                where: { isMystery: true },
                data: { isMystery: false },
            });
        }

        const mysteryUntilDate = parseMysteryUntil(
            body.isMystery ? body.mysteryUntil : null
        );

        // Mise à jour principale
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
                // Ajout de la logique mystère
                isMystery: body.isMystery ?? false,
                mysteryUntil: mysteryUntilDate,
                article: body.articleId
                    ? { connect: { id: body.articleId } }
                    : { disconnect: true },
            },
        });

        // Relations themes/types/images
        await prisma.gameTheme.deleteMany({ where: { gameId: context.params.id } });
        await prisma.gameType.deleteMany({ where: { gameId: context.params.id } });
        await prisma.extraImage.deleteMany({ where: { gameId: context.params.id } });

        if (body.extraImages?.length) {
            await prisma.extraImage.createMany({
                data: body.extraImages.map((url: string) => ({
                    gameId: context.params.id,
                    imageUrl: url,
                })),
            });
        }

        if (body.themeIds?.length) {
            await prisma.gameTheme.createMany({
                data: body.themeIds.map((themeId: string) => ({ gameId: context.params.id, themeId })),
            });
        }

        if (body.typeIds?.length) {
            await prisma.gameType.createMany({
                data: body.typeIds.map((typeId: string) => ({ gameId: context.params.id, typeId })),
            });
        }

        return NextResponse.json({ message: "Mis à jour", game });
    });

}

// DELETE d'une activité
export async function DELETE(req: NextRequest, context: { params: { id: string } }) {
    return withAdminGuard(req, async (_req) => {
        await prisma.printableGame.delete({ where: { id: context.params.id } });
        return NextResponse.json({ message: "Supprimé" });
    });
}
