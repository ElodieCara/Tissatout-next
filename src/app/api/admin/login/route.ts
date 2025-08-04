import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
    const { password } = await req.json();

    // Récupérer les comptes admin
    const admins = await prisma.admin.findMany(); // si modèle = "model admin"
    console.log("📌 Admins dans la base :", admins);

    // Vérification des mots de passe hashés
    for (const admin of admins) {
        const isValid = await bcrypt.compare(password, admin.password);
        if (isValid) {
            const token = jwt.sign(
                { role: "admin", email: admin.email },
                process.env.SECRET_KEY as string,
                { expiresIn: "1h" }
            );

            const response = NextResponse.json({ message: "Authentification réussie" });
            response.cookies.set("auth_token", token, {
                httpOnly: true,
                path: "/",
                maxAge: 3600,
            });

            return response;
        }
    }

    // Aucun mot de passe correct
    return NextResponse.json({ error: "Mot de passe incorrect" }, { status: 401 });
}
