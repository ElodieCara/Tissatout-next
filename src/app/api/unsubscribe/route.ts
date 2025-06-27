import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const { token } = await request.json();

        if (!token) {
            return NextResponse.json({ error: "Token requis" }, { status: 400 });
        }

        const subscriber = await prisma.subscriber.findFirst({ where: { confirmationToken: token } });
        if (!subscriber) {
            return NextResponse.json({ error: "Aucun abonné trouvé" }, { status: 404 });
        }

        await prisma.subscriber.update({
            where: { id: subscriber.id },
            data: { status: "unsubscribed", confirmationToken: null },
        });

        return NextResponse.json({ message: "✅ Désinscription effectuée" });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
