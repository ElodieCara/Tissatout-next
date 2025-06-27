import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { encryptEmail } from "@/lib/crypto";
import crypto from "crypto"; // Pour hash + confirmationToken
import { Resend } from "resend";

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

        // 👇 9️⃣ ENVOI DU MAIL DE CONFIRMATION AVEC RESEND
        const resend = new Resend(process.env.RESEND_API_KEY!);
        const confirmationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/confirm?token=${confirmationToken}`;
        const unsubscribeUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/unsubscribe?token=${confirmationToken}`;

        const { error } = await resend.emails.send({
            from: "contact@tissatout.fr",
            to: normalizedEmail,
            subject: "Confirmez votre inscription",
            text: `Bienvenue sur Tissatout !
            
            Cliquez ici pour confirmer : ${confirmationUrl}
            
            Si vous ne souhaitez plus recevoir nos emails, vous pouvez vous désinscrire en un clic ici : ${unsubscribeUrl}

            Merci.
            `
        });

        if (error) {
            console.error(error);
            return NextResponse.json({ error: "Échec de l'envoi du mail de confirmation" }, { status: 500 });
        }

        return NextResponse.json(
            { message: "Inscription réussie ! Veuillez confirmer votre email.", id: newUser.id },
            { status: 201 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
    }
}
