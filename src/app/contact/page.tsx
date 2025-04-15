// app/contact/page.tsx
"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Head from "next/head";

export default function ContactPage() {
    const [form, setForm] = useState({ name: "", email: "", message: "" });
    const [sending, setSending] = useState(false);
    const [status, setStatus] = useState("");
    const params = useSearchParams();
    const defaultMessage = params.get("message");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSending(true);
        setStatus("");

        const res = await fetch("/api/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });

        const data = await res.json();
        setSending(false);

        if (res.ok) {
            setStatus("✅ Merci pour votre message !");
            setForm({ name: "", email: "", message: "" });
        } else {
            setStatus("❌ Une erreur est survenue.");
        }
    };

    return (
        <div className="page-contact">
            <Head>
                <title>Contact | Tissatout</title>
                <meta name="description" content="Contactez Tissatout pour toute question, idée ou partenariat." />
            </Head>

            <h1>Contactez-nous</h1>

            {defaultMessage && <p className="success">{decodeURIComponent(defaultMessage)}</p>}
            {status && <p className={status.startsWith("✅") ? "success" : "error"}>{status}</p>}

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Votre nom</label>
                    <input type="text" id="name" name="name" value={form.name} onChange={handleChange} required />
                </div>

                <div>
                    <label htmlFor="email">Votre email</label>
                    <input type="email" id="email" name="email" value={form.email} onChange={handleChange} required />
                </div>

                <div>
                    <label htmlFor="message">Message</label>
                    <textarea id="message" name="message" rows={6} value={form.message} onChange={handleChange} required />
                </div>

                <button type="submit" disabled={sending}>
                    {sending ? "Envoi en cours..." : "Envoyer"}
                </button>
            </form>
        </div>
    );
}
