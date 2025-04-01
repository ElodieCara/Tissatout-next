import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// 🟢 GET : récupérer une catégorie par ID
export async function GET(
    req: NextRequest,
    context: { params: { id: string } }
) {
    const { id } = context.params;

    try {
        const ageCategory = await prisma.ageCategory.findUnique({
            where: { id },
            include: {
                tags: {
                    include: {
                        tag: true, // ← on inclut les infos du vrai tag ici
                    },
                },
            },
        });

        if (!ageCategory) {
            return NextResponse.json({ error: "Non trouvé" }, { status: 404 });
        }

        // Nettoyage : on renvoie les tags directement (simplifié pour le front)
        const formatted = {
            ...ageCategory,
            tags: ageCategory.tags.map((pivot) => pivot.tag),
        };

        return NextResponse.json(formatted);
    } catch (error) {
        console.error("❌ Erreur GET AgeCategory :", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}


// 🟡 PUT : modifier une catégorie
export async function PUT(
    req: NextRequest,
    context: { params: { id: string } }
) {
    const { id } = context.params;

    try {
        const body = await req.json();

        // 1. Supprimer les anciens pivots (clean total)
        await prisma.ageCategoryTag.deleteMany({
            where: { ageCategoryId: id },
        });

        // 2. Reconnecter ou créer les tags
        const tagOperations = await Promise.all(
            (body.tags || [])
                .filter((tag: any) => tag.label && tag.color)
                .map(async (tag: any) => {
                    const upserted = await prisma.tag.upsert({
                        where: {
                            label_color: {
                                label: tag.label,
                                color: tag.color,
                            },
                        },
                        update: {},
                        create: {
                            label: tag.label,
                            color: tag.color,
                        },
                    });

                    return {
                        tagId: upserted.id,
                        ageCategoryId: id,
                    };
                })
        );

        // 3. Réinsertion dans le pivot
        await prisma.ageCategoryTag.createMany({
            data: tagOperations,
        });

        // 4. Mise à jour de la catégorie
        const updated = await prisma.ageCategory.update({
            where: { id },
            data: {
                title: body.title,
                slug: body.slug,
                description: body.description,
                imageCard: body.imageCard,
                imageBanner: body.imageBanner,
                content: body.content ?? "",
                conclusion: body.conclusion ?? "",
                activityList: body.activityList ?? [],
            },
            include: {
                tags: {
                    include: {
                        tag: true,
                    },
                },
            },
        });

        return NextResponse.json({
            ...updated,
            tags: updated.tags.map((pivot) => pivot.tag),
        });
    } catch (error) {
        console.error("❌ Erreur PUT AgeCategory :", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}



// 🔴 DELETE : supprimer une catégorie
export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await prisma.ageCategory.delete({
            where: { id: params.id },
        });

        return NextResponse.json({ message: "✅ Supprimé avec succès" });
    } catch (error) {
        console.error("❌ Erreur DELETE AgeCategory :", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
