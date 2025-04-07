import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const comments = await prisma.comment.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                article: {
                    select: {
                        title: true,
                        slug: true,
                    },
                },
            },
        });

        return NextResponse.json(comments);
    } catch (error) {
        console.error("Erreur dans GET /api/comments/moderation", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
