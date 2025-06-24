import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { withAdminGuard } from "@/lib/auth.guard";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    return withAdminGuard(req, async (_req) => {
        const usage = await prisma.gameType.findFirst({
            where: { typeId: params.id }
        });

        if (usage) {
            return NextResponse.json(
                { message: "❌ Ce type est encore utilisé dans un jeu. Suppression interdite." },
                { status: 400 }
            );
        }

        await prisma.activityType.delete({
            where: { id: params.id },
        });

        return NextResponse.json({ message: "✅ Type supprimé." });
    });
}
