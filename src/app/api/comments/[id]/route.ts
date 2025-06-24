// app/api/comments/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { withAdminGuard } from "@/lib/auth.guard";
import prisma from "@/lib/prisma";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    return withAdminGuard(req, async (_req) => {
        const id = params.id;
        const body = await req.json();
        const { approved } = body;

        try {
            const updated = await prisma.comment.update({
                where: { id },
                data: { approved },
            });
            return NextResponse.json(updated);
        } catch (error) {
            console.error("Erreur lors de la mise à jour :", error);
            return NextResponse.json({ error: "Erreur lors de la mise à jour" }, { status: 500 });
        }
    });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    return withAdminGuard(req, async (_req) => {
        const id = params.id;

        try {
            await prisma.comment.delete({ where: { id } });
            // Pour un DELETE, soit on retourne 204 sans contenu, soit 200 avec un message
            return NextResponse.json({ message: "Commentaire supprimé avec succès" }, { status: 200 });
        } catch (error) {
            console.error("Erreur lors de la suppression :", error);
            return NextResponse.json({ error: "Erreur lors de la suppression" }, { status: 500 });
        }
    });
}