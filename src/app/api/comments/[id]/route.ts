import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
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
        return NextResponse.json({ error: "Erreur lors de la mise à jour" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    const id = params.id;

    try {
        await prisma.comment.delete({ where: { id } });
        return NextResponse.json({ message: "Supprimé" }, { status: 204 });
    } catch (error) {
        return NextResponse.json({ error: "Erreur lors de la suppression" }, { status: 500 });
    }
}
