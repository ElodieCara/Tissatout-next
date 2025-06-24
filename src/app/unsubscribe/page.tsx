"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function UnsubscribePage() {
    const searchParams = useSearchParams();
    const hash = searchParams?.get("hash");
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

    useEffect(() => {
        const unsubscribe = async () => {
            if (!hash) {
                setStatus("error");
                return;
            }
            try {
                const response = await fetch("/api/subscribe/unsubscribe", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ hash }),
                });
                if (!response.ok) {
                    setStatus("error");
                } else {
                    setStatus("success");
                }
            } catch {
                setStatus("error");
            }
        };
        unsubscribe();
    }, [hash]);

    return (
        <main className="unsubscribe-container">
            {status === "loading" && <h1>Désinscription en cours…</h1>}
            {status === "success" && (
                <>
                    <h1>✅ Désinscription réussie</h1>
                    <p>Votre adresse a été retirée de la liste de diffusion.</p>
                </>
            )}
            {status === "error" && (
                <>
                    <h1>❌ Erreur</h1>
                    <p>Impossible de vous désinscrire. Veuillez contacter le support.</p>
                </>
            )}
            <style>{`
        .unsubscribe-container {
          font-family: Arial, sans-serif;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 20px;
          text-align: center;
        }
        h1 {
          font-size: 2rem;
          font-weight: bold;
        }
        p {
          font-size: 1rem;
          margin-top: 10px;
        }
      `}</style>
        </main>
    );
}
