import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        await prisma.subscriber.delete({ where: { id: params.id } });
        return NextResponse.json({ message: "Supprimé avec succès" });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}



