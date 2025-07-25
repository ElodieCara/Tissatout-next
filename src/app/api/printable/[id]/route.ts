import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import path from "path";
import { unlink } from "fs/promises";
import { withAdminGuard } from "@/lib/auth.guard";
import { ObjectId } from "mongodb";

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

    // 🔒 Vérifie si l'id est un ObjectId MongoDB valide
    if (!ObjectId.isValid(params.id)) {
        return NextResponse.json(
            { error: "Invalid id" },
            { status: 400 }
        );
    }

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
    // 🔒 Vérifie si l'id est un ObjectId MongoDB valide
    if (!ObjectId.isValid(context.params.id)) {
        return NextResponse.json(
            { error: "Invalid id" },
            { status: 400 }
        );
    }

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

        if (Array.isArray(body.extraImages) && body.extraImages.length > 0) {
            // on ne supprime et ne recrée que s’il y a au moins une entrée
            await prisma.extraImage.deleteMany({ where: { gameId: context.params.id } });
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
export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const id = params.id;
    if (!ObjectId.isValid(id)) {
        return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    return withAdminGuard(req, async () => {
        // 1️⃣ Supprimer d'abord les ExtraImage liées
        await prisma.extraImage.deleteMany({ where: { gameId: id } });

        // 2️⃣ Supprimer les fichiers sur le disque (optionnel)
        const game = await prisma.printableGame.findUnique({
            where: { id },
            select: { imageUrl: true, extraImages: true },
        });
        if (game?.imageUrl) {
            const fn = game.imageUrl.split("/uploads/")[1];
            await unlink(path.join(process.cwd(), "public/uploads", fn)).catch(() => null);
        }
        for (const img of game?.extraImages || []) {
            const fn = img.imageUrl.split("/uploads/")[1];
            await unlink(path.join(process.cwd(), "public/uploads", fn)).catch(() => null);
        }

        // 3️⃣ Enfin, supprimer le PrintableGame
        await prisma.printableGame.delete({ where: { id } });
        return NextResponse.json({ message: "✅ PrintableGame supprimé avec images." });
    });
}



