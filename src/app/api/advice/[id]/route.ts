import { PrismaClient } from "@prisma/client";
import { NextResponse, NextRequest } from "next/server";
import path from "path";
import { unlink } from "fs/promises";
import { withAdminGuard } from "@/lib/auth.guard";

const prisma = new PrismaClient();

interface AdviceBody {
    title: string;
    content: string;
    category: string;
    description?: string;
    imageUrl?: string;
    author?: string;
    ageCategories?: string[];
    sections?: { title: string; content: string; style?: string; imageUrl?: string }[];
    relatedAdvices?: string[];
    relatedActivities?: string[];
    relatedArticles?: string[];
    relatedColorings?: string[];
}

// 🟢 GET : Récupérer un conseil
export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    return withAdminGuard(req, async () => {
        const { id } = params;
        if (!id) {
            return NextResponse.json({ error: "❌ ID manquant." }, { status: 400 });
        }

        const advice = await prisma.advice.findUnique({
            where: { id },
            include: {
                ageCategories: { include: { ageCategory: true } },
                sections: true,
                relatedFrom: { include: { toAdvice: true } },
                relatedActivities: { include: { toActivity: true } },
                relatedArticles: { include: { toArticle: true } },
                relatedColorings: { include: { toColoring: true } },
            },
        });

        if (!advice) {
            return NextResponse.json({ error: "❌ Conseil introuvable" }, { status: 404 });
        }

        return NextResponse.json({
            ...advice,
            ageCategories: advice.ageCategories.map(ac => ac.ageCategoryId),
        });
    });
}

// 🟡 PUT : Modifier un conseil
export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    return withAdminGuard(req, async () => {
        const { id } = params;
        if (!id) {
            return NextResponse.json({ error: "❌ ID manquant." }, { status: 400 });
        }

        const body: AdviceBody = await req.json();
        const {
            title,
            content,
            category,
            description,
            imageUrl,
            author,
            ageCategories = [],
            sections = [],
            relatedAdvices = [],
            relatedActivities = [],
            relatedArticles = [],
            relatedColorings = [],
        } = body;

        if (!title || !content || !category) {
            return NextResponse.json({ error: "❌ Champs obligatoires manquants." }, { status: 400 });
        }

        // Supprimer tous les anciens liens
        await prisma.relatedAdvice.deleteMany({ where: { fromAdviceId: id } });
        await prisma.relatedActivity.deleteMany({ where: { fromAdviceId: id } });
        await prisma.relatedAdviceArticle.deleteMany({ where: { fromAdviceId: id } });
        await prisma.relatedColoring.deleteMany({ where: { fromAdviceId: id } });

        // Normaliser les IDs de catégories d'âge
        const ageIds = ageCategories.filter(Boolean);

        // Mettre à jour
        const updated = await prisma.advice.update({
            where: { id },
            data: {
                title,
                content,
                category,
                description: description || null,
                imageUrl: imageUrl || null,
                author: author || null,
                ageCategories: {
                    deleteMany: {},
                    create: ageIds.map(ageId => ({ ageCategoryId: ageId })),
                },
                sections: {
                    deleteMany: {},
                    create: sections.map(sec => ({
                        title: sec.title,
                        content: sec.content,
                        style: sec.style || 'classique',
                        imageUrl: sec.imageUrl || null,
                    })),
                },
                relatedFrom: {
                    create: relatedAdvices.map((toAdviceId: string) => ({ toAdviceId })),
                },
                relatedActivities: {
                    create: relatedActivities.map((toActivityId: string) => ({ toActivityId })),
                },
                relatedArticles: {
                    create: relatedArticles.map((toArticleId: string) => ({ toArticleId })),
                },
                relatedColorings: {
                    create: relatedColorings.map((toColoringId: string) => ({ toColoringId })),
                },
            },
            include: {
                ageCategories: { include: { ageCategory: true } },
                sections: true,
                relatedFrom: { include: { toAdvice: true } },
                relatedActivities: { include: { toActivity: true } },
                relatedArticles: { include: { toArticle: true } },
                relatedColorings: { include: { toColoring: true } },
            },
        });

        return NextResponse.json({
            ...updated,
            ageCategories: updated.ageCategories.map(ac => ac.ageCategoryId),
        });
    });
}

// 🔴 DELETE : Supprimer un conseil
export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    return withAdminGuard(req, async () => {
        const { id } = params;
        // Supprimer pivots
        await prisma.relatedAdvice.deleteMany({ where: { fromAdviceId: id } });
        await prisma.relatedAdvice.deleteMany({ where: { toAdviceId: id } });
        // Supprimer image
        const advice = await prisma.advice.findUnique({ where: { id } });
        if (advice?.imageUrl) {
            const fname = advice.imageUrl.split('/uploads/')[1];
            if (fname) await unlink(path.join(process.cwd(), 'public/uploads', fname));
        }
        await prisma.advice.delete({ where: { id } });
        return NextResponse.json({ message: '✅ Conseil supprimé.' });
    });
}
