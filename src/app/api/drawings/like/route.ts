import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(req: Request) {
    try {
        const { id } = await req.json();
        if (!id) {
            return NextResponse.json({ error: "ID du coloriage requis" }, { status: 400 });
        }

        const updatedDrawing = await prisma.drawing.update({
            where: { id },
            data: { likes: { increment: 1 } }, // ✅ Incrémente le like
        });

        return NextResponse.json({ likes: updatedDrawing.likes }, { status: 200 });
    } catch (error) {
        console.error("❌ Erreur API Like :", error);
        return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
    }
}
