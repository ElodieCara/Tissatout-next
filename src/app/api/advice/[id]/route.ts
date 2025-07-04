import { PrismaClient } from "@prisma/client";
import { NextResponse, NextRequest } from "next/server";
import path from "path";
import { unlink } from "fs/promises";
import { withAdminGuard } from "@/lib/auth.guard";

const prisma = new PrismaClient();

// 🟢 GET : Récupérer un conseil
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    return withAdminGuard(req, async (_req) => {
        const { id } = params;

        if (!id) {
            return NextResponse.json({ error: "❌ ID manquant." }, { status: 400 });
        }

        const advice = await prisma.advice.findUnique({
            where: { id },
            include: {
                ageCategories: {
                    include: { ageCategory: true },
                },
                sections: true,
                relatedFrom: {
                    include: { toAdvice: true },
                },
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
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    return withAdminGuard(req, async (_req) => {
        const { id } = params;

        if (!id) {
            return NextResponse.json({ error: "❌ ID manquant." }, { status: 400 });
        }

        const body = await req.json();
        const {
            title,
            content,
            category,
            description,
            imageUrl,
            ageCategories = [],
            sections,
            author,
        } = body;

        if (!title || !content || !category) {
            return NextResponse.json({ error: "❌ Champs obligatoires manquants." }, { status: 400 });
        }

        const ageCategoryIds = ageCategories
            .map((item: any) =>
                typeof item === "object" && item !== null && "id" in item ? item.id : item
            )
            .filter(Boolean);

        const updatedAdvice = await prisma.advice.update({
            where: { id },
            data: {
                title,
                content,
                category,
                description: description || null,
                imageUrl: imageUrl || null,
                author: author || "",
                ageCategories: {
                    deleteMany: {},
                    create: ageCategoryIds.map((ageId: string) => ({ ageCategoryId: ageId })),
                },
                sections: {
                    deleteMany: {},
                    create: sections.map((section: any) => ({
                        title: section.title,
                        content: section.content,
                        style: section.style || "classique",
                        imageUrl: section.imageUrl || "",
                    })),
                },
                relatedFrom: {
                    deleteMany: {},
                    create: (body.relatedAdvices || []).map((id: string) => ({ toAdviceId: id })),
                },
            },
            include: {
                ageCategories: { include: { ageCategory: true } },
                sections: true,
                relatedFrom: { include: { toAdvice: true } },
            },
        });

        return NextResponse.json({
            ...updatedAdvice,
            ageCategories: updatedAdvice.ageCategories.map(ac => ac.ageCategoryId),
        });
    });
}

// 🔴 DELETE : Supprimer un conseil
export async function DELETE(req: NextRequest, context: { params: { id: string } }) {
    return withAdminGuard(req, async () => {
        const { id } = context.params;

        const advice = await prisma.advice.findUnique({ where: { id } });
        if (!advice) {
            return NextResponse.json({ error: "❌ Conseil introuvable" }, { status: 404 });
        }

        // 🔹 Supprimer les pivots
        await prisma.relatedAdvice.deleteMany({ where: { fromAdviceId: id } });
        await prisma.relatedAdvice.deleteMany({ where: { toAdviceId: id } });

        // 🔹 Supprimer l’image
        if (advice.imageUrl) {
            const fileName = advice.imageUrl.split("/uploads/")[1];
            if (fileName) {
                const filePath = path.join(process.cwd(), "public/uploads", fileName);
                await unlink(filePath).catch(() => null);
            }
        }

        // 🔹 Supprimer le conseil
        await prisma.advice.delete({ where: { id } });

        return NextResponse.json({ message: "✅ Conseil supprimé avec image et pivots." });
    });
}

