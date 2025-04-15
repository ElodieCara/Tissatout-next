// app/api/contact/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { name, email, message } = await req.json();

        if (!name || !email || !message) {
            return NextResponse.json({ error: "Tous les champs sont obligatoires." }, { status: 400 });
        }

        // ✉️ Simulation d'envoi : ici tu pourrais brancher Nodemailer, Resend, etc.
        console.log("📩 Message reçu :", { name, email, message });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("❌ Erreur API /contact :", error);
        return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
    }
}
