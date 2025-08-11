import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
    try {
        if (!req.headers.get("content-type")?.includes("application/json")) {
            return NextResponse.json({ error: "Content-Type JSON requis." }, { status: 415 });
        }

        const { name, email, message, website } = await req.json();

        // Honeypot anti-bot (champ caché "website")
        if (website && website.trim() !== "") {
            return NextResponse.json({ ok: true });
        }

        if (!name?.trim() || !email?.includes("@") || !message?.trim()) {
            return NextResponse.json({ error: "Tous les champs sont obligatoires." }, { status: 400 });
        }

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST ?? "mail.gandi.net",
            port: Number(process.env.SMTP_PORT ?? 587),
            secure: (process.env.SMTP_SECURE ?? "false") === "true",
            auth: {
                user: process.env.EMAIL_USER!,
                pass: process.env.EMAIL_PASS!,
            },
        });

        const fromEmail = process.env.FROM_EMAIL ?? "contact@tissatout.fr";
        const toEmail = process.env.CONTACT_INBOX ?? fromEmail;

        await transporter.sendMail({
            from: `Tissatout <${fromEmail}>`,
            to: toEmail,
            replyTo: email,
            subject: "Nouveau message depuis Tissatout",
            text: `Nom: ${name}\nEmail: ${email}\nMessage:\n${message}`,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("❌ Erreur API /contact :", error);
        return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
    }
}
