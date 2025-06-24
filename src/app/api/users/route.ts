import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { withAdminGuard } from "@/lib/auth.guard";

export async function GET(req: NextRequest) {
    return withAdminGuard(req, async (_req) => {
        try {
            const users = await prisma.user.findMany({
                select: {
                    id: true,
                    email: true,
                    // Ajoute ici uniquement les champs utiles à l’admin
                },
            });
            return NextResponse.json(users, { status: 200 });
        } catch (error) {
            console.error("Erreur serveur :", error);
            return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
        }
    });
}

export async function POST(req: NextRequest) {
    return withAdminGuard(req, async (_req) => {
        try {
            const body = await req.json();
            const newUser = await prisma.user.create({ data: body });
            return NextResponse.json(newUser, { status: 201 });
        } catch (error) {
            console.error("Erreur serveur :", error);
            return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
        }
    });
}
