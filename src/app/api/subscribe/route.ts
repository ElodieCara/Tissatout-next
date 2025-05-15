import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Chemin à ajuster selon ton projet
import bcrypt from "bcrypt";

export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        if (!email || !email.includes("@")) {
            return NextResponse.json({ error: "Email invalide." }, { status: 400 });
        }

        // Vérification si l'email existe déjà
        const existingUser = await prisma.subscriber.findUnique({
            where: { email }
        });

        if (existingUser) {
            return NextResponse.json({ error: "Vous êtes déjà inscrit(e)." }, { status: 400 });
        }

        // 🔐 Chiffrement de l'email (optionnel)
        const hashedEmail = await bcrypt.hash(email, 10);

        // 🔄 Enregistrement dans la base avec l'email chiffré
        const newUser = await prisma.subscriber.create({
            data: { email: hashedEmail }
        });

        console.log("✅ Inscription réussie :", newUser);

        return NextResponse.json({ message: "Inscription réussie !" }, { status: 201 });
    } catch (error) {
        console.error("Erreur lors de l'inscription :", error);
        return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
    }
}
