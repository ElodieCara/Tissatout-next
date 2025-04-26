// ✅ FILE: src/app/api/advice/route.ts
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { generateSlug } from "@/lib/utils";

export async function GET() {
    try {
        const advices = await prisma.advice.findMany({
            select: {
                id: true,
                title: true,
                content: true,
                description: true,
                category: true,
                createdAt: true,
                imageUrl: true,
                slug: true,
            },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(advices);
    } catch (error) {
        console.error("❌ Erreur API (GET) :", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { title, content, category, description, imageUrl, ageCategories, sections } = body;

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
                imageUrl: imageUrl || "",
                slug,
                sections: {
                    create: (sections || []).map((section: any) => ({
                        title: section.title,
                        content: section.content,
                        style: section.style || null,
                    }))
                },
                ageCategories: {
                    create: ageCategories?.map((id: string) => ({
                        ageCategoryId: id
                    })) || [],
                }
            },
        });


        return NextResponse.json(newAdvice, { status: 201 });
    } catch (error) {
        console.error("❌ Erreur API (POST) :", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
