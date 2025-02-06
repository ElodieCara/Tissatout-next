import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET : Récupère tous les utilisateurs
export async function GET() {
    try {
        const users = await prisma.user.findMany();
        return NextResponse.json(users, { status: 200 });
    } catch (error) {
        console.error("Erreur serveur :", error);
        return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
    }
}

// POST : Crée un nouvel utilisateur
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const newUser = await prisma.user.create({ data: body });
        return NextResponse.json(newUser, { status: 201 });
    } catch (error) {
        console.error("Erreur serveur :", error);
        return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
    }
}
