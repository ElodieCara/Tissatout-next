"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function ConfirmPage() {
    const searchParams = useSearchParams();
    const token = searchParams?.get("token");
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

    useEffect(() => {
        if (!token) {
            setStatus("error");
            return;
        }

        fetch(`/api/confirm?token=${token}`)
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Confirmation échouée");
                }
                return res.json();
            })
            .then(() => {
                setStatus("success");
            })
            .catch(() => {
                setStatus("error");
            });
    }, [token]);

    return (
        <main className="confirm-page">
            {status === "loading" && <div className="confirm-page__loading">Vérification en cours…</div>}

            {status === "success" && (
                <>
                    <h1 className="confirm-page__title">✅ Email confirmé !</h1>
                    <p className="confirm-page__text">Merci, votre abonnement est actif. À bientôt !</p>
                    <Link href="/" className="confirm-page__link">← Retour à l’accueil</Link>
                </>
            )}

            {status === "error" && (
                <>
                    <h1 className="confirm-page__title">❌ Lien invalide</h1>
                    <p className="confirm-page__text">Ce lien est invalide ou a expiré. Veuillez tenter de vous inscrire à nouveau.</p>
                    <Link href="/" className="confirm-page__link">← Retour à l’accueil</Link>
                </>
            )}
            <style>{`
                .confirm-page {
                    font-family: Arial, sans-serif;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    padding: 4rem 1rem;
                    text-align: center;
                }
                .confirm-page__title {
                    font-size: 2rem;
                    font-weight: bold;
                    color: #2c3f64;
                }
                .confirm-page__text {
                    font-size: 1rem;
                    color: #333;
                    margin: 1rem 0;
                }
                .confirm-page__link {
                    font-size: 1rem;
                    font-weight: bold;
                    color: #f9b233;
                    text-decoration: none;
                    border: 2px solid #f9b233;
                    padding: 0.5rem 1rem;
                    border-radius: 4px;
                    transition: background 0.3s, color 0.3s;
                }
                .confirm-page__link:hover {
                    background: #f9b233;
                    color: #fff;
                }
                .confirm-page__loading {
                    font-size: 1rem;
                    color: #2c3f64;
                }
            `}</style>
        </main>
    );
}
