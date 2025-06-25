import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { encryptEmail } from "@/lib/crypto";
import crypto from "crypto"; // Pour hash + confirmationToken
import nodemailer from "nodemailer"; // À installer si pas déjà fait

// ------------------------------------------------------
// ✅ GET : Confirmer une adresse e‑mail
// ------------------------------------------------------
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

// ------------------------------------------------------
// ✅ POST : Inscrire un nouvel abonné
// ------------------------------------------------------
export async function POST(request: Request) {
    try {
        const { email, website } = await request.json();

        // 👇 1️⃣ Anti‑bot
        if (website && website.trim() !== "") {
            return NextResponse.json({ error: "Bot détecté." }, { status: 403 });
        }

        // 👇 2️⃣ Validation de l'email
        if (!email || !email.includes("@")) {
            return NextResponse.json({ error: "Email invalide." }, { status: 400 });
        }

        // 👇 3️⃣ Normalisation
        const normalizedEmail = email.toLowerCase().trim();

        // 👇 4️⃣ Hash unique de l'email
        const hash = crypto.createHash("sha256").update(normalizedEmail).digest("hex");

        // 👇 5️⃣ Vérification existence
        const existingUser = await prisma.subscriber.findUnique({ where: { emailHash: hash } });
        if (existingUser) {
            return NextResponse.json({ error: "Vous êtes déjà inscrit(e)." }, { status: 400 });
        }

        // 👇 6️⃣ Chiffrement de l'email
        const { iv, data } = encryptEmail(normalizedEmail);

        // 👇 7️⃣ Génération du token de confirmation
        const confirmationToken = crypto.randomBytes(32).toString("hex");

        // 👇 8️⃣ Création du nouvel abonné
        const newUser = await prisma.subscriber.create({
            data: {
                emailData: data,
                emailIv: iv,
                emailHash: hash,
                status: "pending",
                confirmationToken,
            },
        });

        // 👇 9️⃣ Configuration du transporteur Ethereal
        const testAccount = await nodemailer.createTestAccount();
        const transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass,
            },
        });

        // 👇 🔥 Envoi du mail de confirmation
        const info = await transporter.sendMail({
            from: `"Tissatout" <${testAccount.user}>`,
            to: normalizedEmail,
            subject: "Confirmez votre inscription",
            text: `Cliquez ici pour confirmer : http://localhost:3000/confirm?token=${confirmationToken}`
        });

        // 👇 ⚡️ Log du lien de test Ethereal
        console.log("Prévisualisation du mail Ethereal:", nodemailer.getTestMessageUrl(info));

        return NextResponse.json(
            { message: "Inscription réussie ! Veuillez confirmer votre email.", id: newUser.id },
            { status: 201 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
    }
}
