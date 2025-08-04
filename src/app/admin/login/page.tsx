"use client";

import { useState } from "react";

export default function AdminLoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleLogin(event: React.FormEvent) {
        event.preventDefault();
        setLoading(true);
        const res = await fetch("/api/admin/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });
        setLoading(false);

        if (!res.ok) {
            setError("Mot de passe incorrect");
        } else {
            window.location.href = "/admin";
        }
    }

    return (
        <main
            style={{
                fontFamily: "sans-serif",
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: `linear-gradient(135deg, #2c3f64 40%, #316470 100%)`,
            }}
        >
            <form
                onSubmit={handleLogin}
                style={{
                    padding: "2rem",
                    borderRadius: "12px",
                    backgroundColor: "#ffffff",
                    boxShadow: "0px 4px 16px rgba(0,0,0,0.2)",
                    textAlign: "center",
                    maxWidth: "360px",
                    width: "100%",
                }}
            >
                <h1
                    style={{
                        fontSize: "1.8rem",
                        color: "#2c3f64",
                        marginBottom: "1rem",
                        fontWeight: "bold",
                    }}
                >
                    Connexion Admin
                </h1>
                <input
                    type="email"
                    placeholder="Adresse email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                        padding: "0.75rem",
                        fontSize: "1rem",
                        borderRadius: "6px",
                        border: "1px solid #ccc",
                        marginBottom: "1rem",
                        width: "100%",
                        boxSizing: "border-box",
                    }}
                />

                <input
                    type="password"
                    placeholder="Mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                        padding: "0.75rem",
                        fontSize: "1rem",
                        borderRadius: "6px",
                        border: "1px solid #ccc",
                        marginBottom: "1rem",
                        width: "100%",
                        boxSizing: "border-box",
                    }}
                />
                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        padding: "0.75rem",
                        fontSize: "1rem",
                        fontWeight: "bold",
                        borderRadius: "6px",
                        border: "none",
                        cursor: "pointer",
                        backgroundColor: "#FDCA57",
                        color: "#2c3f64",
                        transition: "background-color 0.3s",
                        width: "100%",
                    }}
                >
                    {loading ? "Connexion…" : "Se Connecter"}
                </button>
                {error && (
                    <p style={{ color: "#F78E74", marginTop: "1rem" }}>{error}</p>
                )}
            </form>
        </main>
    );
}
