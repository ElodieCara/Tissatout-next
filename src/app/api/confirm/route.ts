import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const token = searchParams.get("token");

        if (!token) {
            return NextResponse.json({ error: "Token manquant." }, { status: 400 });
        }

        const subscriber = await prisma.subscriber.findFirst({
            where: { confirmationToken: token },
        });
        if (!subscriber) {
            return NextResponse.json({ error: "Token invalide." }, { status: 404 });
        }

        await prisma.subscriber.update({
            where: { id: subscriber.id },
            data: {
                status: "confirmed",
                confirmedAt: new Date(),
                confirmationToken: null,
            },
        });

        return NextResponse.json({ message: "✅ Email confirmé !" });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
    }
}
