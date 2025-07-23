import prisma from "@/lib/prisma";
import { generateSlug } from "@/lib/utils";
import { NextResponse, NextRequest } from "next/server";
import { withAdminGuard } from "@/lib/auth.guard";

// 🎨 Correspondance FR → EN
const themeMapping: Record<string, string> = {
    "Hiver": "winter",
    "Printemps": "spring",
    "Été": "summer",
    "Automne": "autumn",
    "Toussaint": "toussaint",
    "Noël": "christmas",
    "Pâques": "easter",
    "Epiphanie": "epiphanie",
    "Chandeleur": "chandeleur",
    "Saint-Jean": "saint-jean",
};

export async function GET() {
    try {
        const ideas = await prisma.idea.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                ageCategories: {
                    include: { ageCategory: true },
                },
                sections: true,
            },
        });

        return NextResponse.json(ideas);
    } catch (error) {
        console.error("❌ Erreur GET /api/ideas :", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}


// ✅ Ajouter une nouvelle idée AVEC liaison à une ou plusieurs catégories d'âge via ID
export async function POST(req: NextRequest) {
    return withAdminGuard(req, async (_req) => {
        try {
            const body = await req.json();
            const { title, description, theme, image, ageCategoryIds, sections, relatedArticleIds, relatedColoringIds,
                relatedActivityIds } = body;

            if (!title?.trim() || !description?.trim() || !theme?.trim() || !Array.isArray(ageCategoryIds) || ageCategoryIds.length === 0) {
                return NextResponse.json(
                    { error: "Champs requis manquants ou invalides." },
                    { status: 400 }
                );
            }

            const themeEn = themeMapping[theme.trim()] || theme.trim();
            const slug = generateSlug(title);

            const newIdea = await prisma.idea.create({
                data: {
                    title: title.trim(),
                    slug,
                    description: description.trim(),
                    theme: themeEn,
                    image: image?.trim() || null,
                    ageCategories: {
                        create: ageCategoryIds.map((ageId: string) => ({
                            ageCategory: { connect: { id: ageId } }
                        }))
                    },
                    sections: {
                        create: sections.map((section: any) => ({
                            title: section.title,
                            content: section.content,
                            style: section.style || "classique",
                            imageUrl: section.imageUrl || null,
                            relatedColoring: section.relatedColoringId
                                ? { connect: { id: section.relatedColoringId } }
                                : undefined,
                            relatedActivity: section.relatedActivityId
                                ? { connect: { id: section.relatedActivityId } }
                                : undefined,
                        }))
                    }
                },
                include: {
                    ageCategories: { include: { ageCategory: true } },
                    sections: true
                }
            });

            // 🔗 Liaison des articles
            if (relatedArticleIds && relatedArticleIds.length > 0) {
                await prisma.relatedIdeaArticle.createMany({
                    data: relatedArticleIds.map((articleId: string) => ({
                        fromIdeaId: newIdea.id,
                        toArticleId: articleId,
                    }))
                });
            }

            // 🔗 Liaison des coloriages (1 par section)
            const coloringLinks = sections
                .map((section: any) =>
                    section.relatedColoringId
                        ? {
                            fromIdeaId: newIdea.id,
                            toColoringId: section.relatedColoringId,
                        }
                        : null
                )
                .filter(Boolean) as { fromIdeaId: string; toColoringId: string }[];

            if (coloringLinks.length > 0) {
                await prisma.relatedIdeaColoring.createMany({ data: coloringLinks });
            }

            // 🔗 Liaison des activités (1 par section)
            const activityLinks = sections
                .map((section: any) =>
                    section.relatedActivityId
                        ? {
                            fromIdeaId: newIdea.id,
                            toActivityId: section.relatedActivityId,
                        }
                        : null
                )
                .filter(Boolean) as { fromIdeaId: string; toActivityId: string }[];

            if (activityLinks.length > 0) {
                await prisma.relatedIdeaActivity.createMany({ data: activityLinks });
            }

            return NextResponse.json(newIdea, { status: 201 });

        } catch (error) {
            console.error("❌ Erreur POST /api/ideas :", error);
            return NextResponse.json(
                { error: "Erreur serveur", details: (error as Error).message },
                { status: 500 }
            );
        }
    });
}


