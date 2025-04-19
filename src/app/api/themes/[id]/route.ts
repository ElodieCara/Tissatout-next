import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
    const usage = await prisma.gameTheme.findFirst({
        where: { themeId: params.id }
    });

    if (usage) {
        return NextResponse.json(
            { message: "❌ Ce thème est encore utilisé dans un jeu. Suppression interdite." },
            { status: 400 }
        );
    }

    await prisma.theme.delete({
        where: { id: params.id },
    });

    return NextResponse.json({ message: "✅ Thème supprimé." });
}
