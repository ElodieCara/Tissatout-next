import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const { hash } = await request.json();

        if (!hash) {
            return NextResponse.json({ error: "Hash requis" }, { status: 400 });
        }

        const subscriber = await prisma.subscriber.findUnique({ where: { emailHash: hash } });
        if (!subscriber) {
            return NextResponse.json({ error: "Aucun abonné trouvé" }, { status: 404 });
        }

        await prisma.subscriber.delete({ where: { id: subscriber.id } });
        return NextResponse.json({ message: "✅ Désinscription effectuée" });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
