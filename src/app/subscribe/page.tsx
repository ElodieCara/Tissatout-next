"use client";

import Image from "next/image";
import FloatingIconsEnhanced from "@/components/FloatingIcon/FloatingIconsEnhanced";
import React, { useState } from "react";

export default function SubscribePage() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [website, setWebsite] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        if (website) {
            setMessage("Bot détecté.");
            setLoading(false);
            return;
        }

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
            console.error(error);
            setMessage("Impossible de se connecter. Réessayez plus tard.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="subscribe-page">
            <section className="subscribe-page__container">
                <div className="subscribe-page__image">
                    <img
                        src="/icons/subscribe/subscribechilds.png"
                        alt="Subscribe Childs"
                        width={500}
                        height={500}
                    />
                </div>
                <div className="subscribe-page__text">
                    <h1>Rejoins la communauté des petites mains créatives !</h1>
                    <p className="line"> <Image src="/icons/cloche.png" alt="Pas de spam" width={24} height={24} />
                        Des ressources exclusives chaque semaine
                    </p>
                    <p className="line"> <Image src="/icons/heart.png" alt="Pas de spam" width={24} height={24} />
                        Une newsletter pleine de trésors pour accompagner vos enfants</p>
                </div>
                <div className="subscribe-page__gradient"
                    style={{
                        background: 'linear-gradient(135deg, #529393 0%, #c4c39d  100%)',

                    }}
                >
                    <FloatingIconsEnhanced />
                    <div className="subscribe-page__card">

                        <h2>Abonnez‑vous à notre newsletter</h2>
                        <p>Et recevez des idées, des jeux à imprimer, des nouvelles du site ainsi que des ressources exclusives !</p>
                        <form onSubmit={handleSubmit}>
                            <input
                                type="email"
                                placeholder="Votre adresse e‑mail"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <input
                                type="text"
                                name="website"
                                value={website}
                                onChange={(e) => setWebsite(e.target.value)}
                                style={{ display: "none" }}
                                tabIndex={-1}
                                autoComplete="off"
                            />
                            <button type="submit" disabled={loading}>
                                {loading ? "Inscription…" : "Je m’abonne"}
                            </button>
                        </form>
                        {message && <p className="subscribe-page__message">{message}</p>}

                        <div className="subscribe-page__assurance">
                            <p className="line">
                                <Image src="/icons/enveloppebleu.png" alt="Pas de spam" width={24} height={24} />
                                Pas de spam, que du contenu utile
                            </p>
                            <p className="line"> <Image src="/icons/desinscription.png" alt="Pas de spam" width={24} height={24} />
                                Désinscription en 1 clic
                            </p>
                            <p className="line"> <Image src="/icons/bouier.png" alt="Pas de spam" width={24} height={24} />
                                Respect de vos données personnelles
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
