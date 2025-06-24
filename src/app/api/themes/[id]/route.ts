import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { withAdminGuard } from "@/lib/auth.guard";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    return withAdminGuard(req, async (_req) => {
        const usage = await prisma.gameTheme.findFirst({
            where: { themeId: params.id },
        });

        if (usage) {
            return NextResponse.json(
                { message: "❌ Ce thème est encore utilisé dans un jeu. Suppression interdite." },
                { status: 400 }
            );
        }

        await prisma.theme.delete({ where: { id: params.id } });
        return NextResponse.json({ message: "✅ Thème supprimé." });
    });
}
