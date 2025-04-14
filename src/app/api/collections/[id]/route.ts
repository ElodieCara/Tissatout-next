// /app/api/collections/[id]/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
    const { id } = params;

    try {
        await prisma.collection.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("Erreur suppression collection :", err);
        return NextResponse.json({ error: "Impossible de supprimer la collection." }, { status: 500 });
    }
}
