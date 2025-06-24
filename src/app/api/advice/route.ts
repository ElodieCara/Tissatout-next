// ✅ FILE: src/app/api/advice/route.ts
import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { generateSlug } from "@/lib/utils";
import { withAdminGuard } from "@/lib/auth.guard";

export async function GET() {
    try {
        const advices = await prisma.advice.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                relatedFrom: {
                    include: {
                        toAdvice: true,
                    },
                },
            },
        });

        return NextResponse.json(advices);
    } catch (error) {
        console.error("❌ Erreur API (GET) :", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    return withAdminGuard(req, async (_req) => {
        try {
            const body = await req.json();
            const { title, content, category, description, imageUrl, ageCategories, sections, author, relatedAdvices } = body; // 🛠 lié ajouté ici

            if (!title || !content || !category) {
                return NextResponse.json({ error: "❌ Champs obligatoires manquants" }, { status: 400 });
            }

            const safeId = crypto.randomUUID().slice(0, 6);
            const slug = body.slug?.trim() || generateSlug(title, safeId);

            const exists = await prisma.advice.findUnique({ where: { slug } });
            if (exists) {
                return NextResponse.json({ error: "Slug déjà utilisé." }, { status: 400 });
            }

            const newAdvice = await prisma.advice.create({
                data: {
                    title,
                    content,
                    category,
                    description,
                    author: author || "",
                    imageUrl: imageUrl || "",
                    slug,
                    sections: {
                        create: sections?.map((section: any) => ({
                            title: section.title,
                            content: section.content,
                            style: section.style || "classique",
                            imageUrl: section.imageUrl || "",
                        })) || [],
                    },
                    ageCategories: {
                        create: ageCategories?.map((id: string) => ({
                            ageCategoryId: id
                        })) || [],
                    },
                    relatedFrom: { // 🛠 lié ajouté ici
                        create: relatedAdvices?.map((id: string) => ({
                            toAdviceId: id,
                        })) || [],
                    }
                },
            });

            return NextResponse.json(newAdvice, { status: 201 });
        } catch (error) {
            console.error("❌ Erreur API (POST) :", error);
            return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
        }
    });
}
