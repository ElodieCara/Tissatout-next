"use client";

import { useState } from "react";


export default function ContactPage() {
    const [form, setForm] = useState({ name: "", email: "", message: "" });
    const [sending, setSending] = useState(false);
    const [status, setStatus] = useState("");

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

        setSending(false);
        if (res.ok) {
            setStatus("✅ Merci, votre message a bien été envoyé.");
            setForm({ name: "", email: "", message: "" });
        } else {
            setStatus("❌ Une erreur est survenue. Merci de réessayer.");
        }
    };

    return (
        <div className="contact-page">
            <div className="contact-page__container">
                <h1>Contactez-nous</h1>
                <p>Une idée, une remarque, une question ? Je vous lis avec attention.</p>

                {status && (
                    <p className={`contact-page__status ${status.startsWith("✅") ? "contact-page__status--success" : "contact-page__status--error"}`}>
                        {status}
                    </p>
                )}

                <div className="contact-page__illustration">
                    <img src="/assets/contact-bird.png" alt="Illustration contact Tissatout" />
                </div>

                <form className="contact-page__form" onSubmit={handleSubmit}>
                    <div className="contact-page__form-group">
                        <label htmlFor="name">Nom</label>
                        <input type="text" id="name" name="name" value={form.name} onChange={handleChange} required />
                    </div>

                    <div className="contact-page__form-group">
                        <label htmlFor="email">Adresse e-mail</label>
                        <input type="email" id="email" name="email" value={form.email} onChange={handleChange} required />
                    </div>

                    <div className="contact-page__form-group">
                        <label htmlFor="message">Message</label>
                        <textarea id="message" name="message" value={form.message} onChange={handleChange} required />
                    </div>

                    <button type="submit" disabled={sending}>
                        {sending ? "Envoi en cours..." : "Envoyer"}
                    </button>
                </form>
            </div>
        </div>
    );
}
