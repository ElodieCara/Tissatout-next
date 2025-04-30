"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function CookieBanner() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem("tissatout_cookie_consent");
        if (!consent) {
            setVisible(true);
        }
    }, []);

    const acceptCookies = () => {
        localStorage.setItem("tissatout_cookie_consent", "accepted");
        setVisible(false);
    };

    if (!visible) {
        return null;
    }

    return (
        <div style={{
            position: "fixed",
            bottom: 0,
            width: "100%",
            backgroundColor: "#2c3f64",
            color: "#ffffff",
            padding: "1rem",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            fontSize: "0.9rem",
            zIndex: 1000,
            textAlign: "center",
        }}>
            <p style={{ marginBottom: "0.5rem" }}>
                Chez Tissatout, votre vie privée est respectée. Pas de publicité, pas de pistage.<br />
                <Link href="/confidentialite" style={{ color: "#f9b233", textDecoration: "underline" }}>
                    Consultez notre politique de confidentialité
                </Link>.
            </p>
            <button
                onClick={acceptCookies}
                style={{
                    marginTop: "0.5rem",
                    backgroundColor: "#f9b233",
                    border: "none",
                    padding: "0.5rem 1rem",
                    borderRadius: "4px",
                    cursor: "pointer",
                    color: "#2c3f64",
                    fontWeight: "bold",
                    width: "auto",
                    minWidth: "150px",
                }}
            >
                OK
            </button>

            <style jsx>{`
                @media (max-width: 600px) {
                    div {
                        font-size: 0.8rem;
                        padding: 0.8rem;
                    }
                    button {
                        width: 90%;
                        font-size: 1rem;
                        padding: 0.6rem;
                    }
                }
            `}</style>
        </div>
    );
}
