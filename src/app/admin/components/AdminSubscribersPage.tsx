"use client";

import { useState, useEffect } from "react";

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
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        async function fetchSubscribers() {
            try {
                const response = await fetch("/api/admin/subscribers");
                if (!response.ok) {
                    throw new Error("Impossible de récupérer les abonnés.");
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

    const filteredSubscribers = subscribers.filter((sub) =>
        sub.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleDelete = async (id: string) => {
        if (!confirm("Supprimer cet abonné ?")) return;

        const response = await fetch(`/api/admin/subscribers/${id}`, {
            method: "DELETE",
        });
        if (response.ok) {
            setSubscribers((prev) => prev.filter((sub) => sub.id !== id));
        } else {
            alert("Erreur lors de la suppression.");
        }
    };

    const exportToCsv = () => {
        const header = "Email,Statut,Date de confirmation\n";
        const rows = filteredSubscribers
            .map((sub) =>
                `${sub.email},${sub.status},${sub.confirmedAt ?? ""}`
            )
            .join("\n");
        const blob = new Blob([header + rows], {
            type: "text/csv",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "subscribers.csv";
        a.click();
    };

    if (loading) {
        return <div>Chargement des abonnés…</div>;
    }

    if (error) {
        return <div>Erreur : {error}</div>;
    }

    return (
        <div className="admin__content">
            <div >
                <h2>👥 Abonnés à la newsletter</h2>

                <div className="select-add__row">
                    <input className="admin__form-input"
                        placeholder="Rechercher par email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button className="admin__button" onClick={exportToCsv}>
                        📥 Exporter en CSV
                    </button>
                </div>

                <table className="admin__list-item-title">
                    <thead>
                        <tr>
                            <th>Email</th>
                            <th>Statut</th>
                            <th>Confirmé le</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredSubscribers.map((sub) => (
                            <tr key={sub.id}>
                                <td>{sub.email}</td>
                                <td>{sub.status}</td>
                                <td>{sub.confirmedAt ? new Date(sub.confirmedAt).toLocaleString() : "–"}</td>
                                <td>
                                    <button className="admin__list-item-button delete" onClick={() => handleDelete(sub.id)}>🗑️</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
