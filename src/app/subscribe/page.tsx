"use client";
import React, { useState } from "react";

export default function SubscribePage() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        if (!email) {
            setMessage("Veuillez entrer un email valide.");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch("/api/subscribe", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            if (response.ok) {
                setMessage("Merci pour votre inscription !");
                setEmail("");
            } else {
                setMessage("Erreur lors de l'inscription. Veuillez réessayer.");
            }
        } catch (error) {
            console.error("Erreur lors de l'envoi :", error);
            setMessage("Impossible de se connecter. Réessayez plus tard.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="subscribe-page">
            <h1>Abonnez-vous à notre Newsletter</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Votre adresse e-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button type="submit" disabled={loading}>
                    {loading ? "Inscription..." : "S'abonner"}
                </button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}
