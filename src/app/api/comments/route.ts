// app/api/comments/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

// Types autorisés pour éviter les injections
const ALLOWED_TYPES = ["article", "advice", "idea", "printable"] as const;
type ResourceType = typeof ALLOWED_TYPES[number];

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") as ResourceType | null;
    const id = searchParams.get("id");

    console.log("GET /api/comments - params:", { type, id });

    if (!type || !id || !ALLOWED_TYPES.includes(type)) {
        return NextResponse.json(
            { error: "Il faut fournir `type=(article|advice|idea|printable)` et `id`" },
            { status: 400 }
        );
    }

    // Construire dynamiquement le filtre
    const where: Record<string, unknown> = { approved: true };
    where[`${type}Id`] = id;

    try {
        const comments = await prisma.comment.findMany({
            where,
            orderBy: { createdAt: "desc" },
        });
        console.log("Comments trouvés:", comments.length);
        return NextResponse.json(comments);
    } catch (err) {
        console.error("Erreur GET /api/comments :", err);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        console.log("POST /api/comments - body reçu:", body);

        const type = body.type as ResourceType | undefined;
        const id = body.id as string | undefined;
        const content = body.content as string | undefined;
        const author = body.author as string | undefined;

        console.log("POST /api/comments - données extraites:", { type, id, content, author });

        // Validation plus détaillée
        if (!content || typeof content !== "string" || content.trim() === "") {
            console.log("Erreur: content invalide");
            return NextResponse.json(
                { error: "Le contenu est requis et ne peut pas être vide" },
                { status: 400 }
            );
        }

        if (!type || !ALLOWED_TYPES.includes(type)) {
            console.log("Erreur: type invalide", type);
            return NextResponse.json(
                { error: "Type invalide. Types autorisés: " + ALLOWED_TYPES.join(", ") },
                { status: 400 }
            );
        }

        if (!id || typeof id !== "string") {
            console.log("Erreur: id invalide", id);
            return NextResponse.json(
                { error: "ID invalide" },
                { status: 400 }
            );
        }

        // Préparer un objet typé pour Prisma
        const data: Prisma.CommentUncheckedCreateInput = {
            content: content.trim(),
            approved: false,
            author: author && author.trim() ? author.trim() : undefined,
        };

        // Affecter dynamiquement la bonne clé étrangère
        switch (type) {
            case "article":
                data.articleId = id;
                break;
            case "advice":
                data.adviceId = id;
                break;
            case "idea":
                data.ideaId = id;
                break;
            case "printable":
                data.printableId = id;
                break;
        }

        console.log("POST /api/comments - données pour Prisma:", data);

        const comment = await prisma.comment.create({ data });
        console.log("POST /api/comments - commentaire créé:", comment);

        return NextResponse.json(comment, { status: 201 });
    } catch (err) {
        console.error("Erreur POST /api/comments :", err);
        return NextResponse.json(
            { error: "Impossible de créer le commentaire: " + (err instanceof Error ? err.message : 'Erreur inconnue') },
            { status: 500 }
        );
    }
}