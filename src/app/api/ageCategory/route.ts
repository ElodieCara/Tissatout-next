import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";

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
                tags: {
                    connectOrCreate: body.tags?.map((tag: any) => ({
                        where: {
                            label: tag.label,
                            color: tag.color,
                        },
                        create: {
                            label: tag.label,
                            color: tag.color,
                        },
                    })) ?? [],
                },
            },
            include: {
                tags: {
                    include: {
                        tag: true,
                    },
                },
            },
        });

        const formatted = {
            ...newCategory,
            tags: newCategory.tags.map((pivot: any) => pivot.tag),
        };

        return NextResponse.json(formatted, { status: 201 });
    } catch (error) {
        console.error("❌ Erreur POST AgeCategory :", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
