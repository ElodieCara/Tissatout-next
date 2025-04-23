import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const data = await prisma.printableGame.findMany({
            include: {
                themes: {
                    include: {
                        theme: true,
                    },
                },
                types: {
                    include: {
                        type: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });

        // 🔥 Filtrer les relations nulles
        const cleaned = data.map(game => ({
            ...game,
            themes: game.themes.filter(t => t.theme !== null),
            types: game.types.filter(t => t.type !== null),
        }));

        return NextResponse.json(cleaned);
    } catch (error) {
        console.error("❌ Erreur GET /api/printable :", error);
        return NextResponse.json({ message: "Erreur serveur", error: (error as Error).message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const body = await req.json();

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
            printPrice: body.printPrice,
            ageMin: body.ageMin,
            ageMax: body.ageMax,
            isFeatured: body.isFeatured,
            article: body.articleId ? { connect: { id: body.articleId } } : undefined,
        },
    });

    // Associer thèmes et types après création
    if (body.themeIds?.length) {
        await prisma.gameTheme.createMany({
            data: body.themeIds.map((themeId: string) => ({
                gameId: game.id,
                themeId,
            })),
        });
    }

    if (body.typeIds?.length) {
        await prisma.gameType.createMany({
            data: body.typeIds.map((typeId: string) => ({
                gameId: game.id,
                typeId,
            })),
        });
    }

    // Créer les extraImages
    if (body.extraImages?.length) {
        await prisma.extraImage.createMany({
            data: body.extraImages.map((url: string) => ({
                gameId: game.id,
                imageUrl: url,
            })),
        });
    }

    return NextResponse.json({ message: "Créé" });
}
