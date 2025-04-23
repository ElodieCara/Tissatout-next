import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

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
            themeIds: game.themes.map((t) => t.theme?.id).filter(Boolean),
            typeIds: game.types.map((t) => t.type?.id).filter(Boolean),
            extraImages: game.extraImages.map((img) => img.imageUrl),
        });
    } catch (error) {
        console.error("❌ Erreur dans GET /api/printable/[id] :", error);
        return NextResponse.json(
            { message: "Erreur serveur", error: (error as Error).message },
            { status: 500 }
        );
    }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    const body = await req.json();

    await prisma.printableGame.update({
        where: { id: params.id },
        data: {
            title: body.title,
            slug: body.slug,
            description: body.description,
            pdfUrl: body.pdfUrl,
            imageUrl: body.imageUrl,
            isPrintable: body.isPrintable,
            printPrice: body.printPrice,
            ageMin: body.ageMin,
            ageMax: body.ageMax,
            isFeatured: body.isFeatured,
            article: body.articleId ? { connect: { id: body.articleId } } : { disconnect: true },
        },
    });

    // Nettoyer et recréer les relations
    await prisma.gameTheme.deleteMany({ where: { gameId: params.id } });
    await prisma.gameType.deleteMany({ where: { gameId: params.id } });
    // Supprimer les anciennes images liées
    await prisma.extraImage.deleteMany({ where: { gameId: params.id } });

    // Recréer les nouvelles
    if (body.extraImages?.length) {
        await prisma.extraImage.createMany({
            data: body.extraImages.map((url: string) => ({
                gameId: params.id,
                imageUrl: url,
            })),
        });
    }

    if (body.themeIds?.length) {
        await prisma.gameTheme.createMany({
            data: body.themeIds.map((themeId: string) => ({ gameId: params.id, themeId })),
        });
    }
    if (body.typeIds?.length) {
        await prisma.gameType.createMany({
            data: body.typeIds.map((typeId: string) => ({ gameId: params.id, typeId })),
        });
    }

    return NextResponse.json({ message: "Mis à jour" });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
    await prisma.printableGame.delete({ where: { id: params.id } });
    return NextResponse.json({ message: "Supprimé" });
}
