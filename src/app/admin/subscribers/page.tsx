"use client";

import { useEffect, useState } from "react";

interface Subscriber {
    id: string;
    email: string;
    status: string;
    confirmedAt: string | null;
}

export default function AdminSubscribersPage() {
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchSubscribers() {
            try {
                const response = await fetch("/api/admin/subscribers");
                if (!response.ok) {
                    throw new Error("Impossible de récupérer les abonnés");
                }
                const data = await response.json();
                setSubscribers(data);
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }
        fetchSubscribers();
    }, []);

    if (loading) {
        return <div>Chargement des abonné·e·s…</div>;
    }

    if (error) {
        return <div>Erreur : {error}</div>;
    }

    return (
        <div style={{ maxWidth: "800px", margin: "2rem auto", fontFamily: "sans-serif" }}>
            <h1>👥 Abonnés à la newsletter</h1>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr>
                        <th>Email</th>
                        <th>Statut</th>
                        <th>Confirmé le</th>
                    </tr>
                </thead>
                <tbody>
                    {subscribers.map((sub) => (
                        <tr key={sub.id}>
                            <td>{sub.email}</td>
                            <td>{sub.status}</td>
                            <td>{sub.confirmedAt ? new Date(sub.confirmedAt).toLocaleString() : "–"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
