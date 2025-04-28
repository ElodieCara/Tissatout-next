import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
    try {
        const { name, email, message } = await req.json();

        if (!name || !email || !message) {
            return NextResponse.json({ error: "Tous les champs sont obligatoires." }, { status: 400 });
        }

        const transporter = nodemailer.createTransport({
            host: "mail.gandi.net",
            port: 587,
            secure: false, // important : STARTTLS sera utilisé automatiquement
            auth: {
                user: process.env.EMAIL_USER!,
                pass: process.env.EMAIL_PASS!,
            },
        });

        await transporter.sendMail({
            from: "Tissatout <contact@tissatout.fr>",  // Email du visiteur affiché comme expéditeur
            to: "contact@tissatout.fr",    // <<< Tu recevras sur ta boîte Tissatout
            subject: "Nouveau message depuis Tissatout",
            text: `
Nom: ${name}
Email: ${email}
Message:
${message}
            `,
        });

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("❌ Erreur API /contact :", error);
        return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
    }
}
