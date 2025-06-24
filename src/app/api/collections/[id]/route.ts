// /app/api/collections/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { withAdminGuard } from "@/lib/auth.guard";
import prisma from "@/lib/prisma";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    return withAdminGuard(req, async (_req) => {
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
    });
}
