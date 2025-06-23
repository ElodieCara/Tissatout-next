// app/api/comments/moderation/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    const comments = await prisma.comment.findMany({
        orderBy: { createdAt: "desc" },
        // on n’inclut plus *tous* les relations en même temps, mais juste ce qui existe
        include: {
            article: true,
            advice: true,
            idea: true,
            printable: true,
        },
    });

    // Normaliser pour renvoyer un titre+slug quel que soit le type
    const normalized = comments.map(c => {
        let label: string, slug: string;
        if (c.article) {
            label = c.article.title; slug = c.article.slug;
        } else if (c.advice) {
            label = c.advice.title; slug = c.advice.slug;
        } else if (c.idea) {
            label = c.idea.title; slug = c.idea.slug;
        } else if (c.printable) {
            label = c.printable.title; slug = c.printable.slug;
        } else {
            label = "–"; slug = "";
        }

        let resourceType = "";
        if (c.article) resourceType = "Article";
        if (c.advice) resourceType = "Conseil";
        if (c.idea) resourceType = "Idée";
        if (c.printable) resourceType = "Activité à imprimer";

        return {
            id: c.id,
            content: c.content,
            approved: c.approved,
            createdAt: c.createdAt,
            resourceLabel: label,
            resourceSlug: slug,
            resourceType,
        };
    });

    return NextResponse.json(normalized);
}
