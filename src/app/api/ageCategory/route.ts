import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { ObjectId } from "mongodb";

export async function GET() {
    try {
        const ageCategories = await prisma.ageCategory.findMany({
            include: {
                tags: {
                    include: {
                        tag: true,
                    },
                },
            },
        });

        const formatted = ageCategories.map((cat) => ({
            ...cat,
            tags: cat.tags.map((pivot) => pivot.tag),
        }));

        return NextResponse.json(formatted);
    } catch (error) {
        console.error("❌ Erreur lors de la récupération des catégories d'âge :", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // 1. Création de la catégorie sans les tags (d’abord)
        const newCategory = await prisma.ageCategory.create({
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
        });

        const ageCategoryId = new ObjectId(newCategory.id);

        // 2. Gestion des tags s’il y en a
        const rawTags = body.tags ?? [];

        const tagOperations = await Promise.all(
            rawTags
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
                        tagId: new ObjectId(upserted.id),
                        ageCategoryId,
                    };
                })
        );

        if (tagOperations.length > 0) {
            await prisma.ageCategoryTag.createMany({
                data: tagOperations,
                skipDuplicates: true,
            } as any);
        }

        // 3. Récupération finale avec les tags
        const withTags = await prisma.ageCategory.findUnique({
            where: { id: newCategory.id },
            include: {
                tags: {
                    include: {
                        tag: true,
                    },
                },
            },
        });

        const formatted = {
            ...withTags,
            tags: withTags?.tags.map((pivot: any) => pivot.tag) ?? [],
        };

        return NextResponse.json(formatted, { status: 201 });
    } catch (error) {
        console.error("❌ Erreur POST AgeCategory :", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}