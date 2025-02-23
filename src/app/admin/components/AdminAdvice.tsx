"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Advice {
    id: string;
    title: string;
    category: string;
}

export default function AdminAdvice() {
    const [advices, setAdvices] = useState<Advice[]>([]);
    const router = useRouter();

    // Charger les conseils depuis l'API
    useEffect(() => {
        fetch("/api/advice")
            .then((res) => res.json())
            .then((data) => setAdvices(data))
            .catch((err) => console.error("Erreur lors du chargement des conseils :", err));
    }, []);

    // Supprimer un conseil
    const handleDelete = async (id: string) => {
        if (!confirm("Voulez-vous vraiment supprimer ce conseil ?")) return;

        const res = await fetch(`/api/advice/${id}`, { method: "DELETE" });
        if (res.ok) {
            setAdvices(advices.filter((advice) => advice.id !== id));
        } else {
            alert("Erreur lors de la suppression du conseil.");
        }
    };

    return (
        <div className="admin__section">
            <h2>📜 Gestion des Conseils</h2>
            <button onClick={() => router.push("/admin/advice/new")} className="admin__button">
                ➕ Ajouter un Conseil
            </button>
            <div className="admin__list">
                {advices.length > 0 ? (
                    advices.map((advice) => (
                        <div key={advice.id} className="admin__list-item">
                            <span className="admin__list-item-title">{advice.title}</span>
                            <span className="admin__list-item-category">({advice.category})</span>
                            <div className="admin__list-item-button">
                                <button
                                    onClick={() => router.push(`/admin/advice/${advice.id}/edit`)}
                                    className="admin__list-item-button edit"
                                >
                                    ✏️ Modifier
                                </button>
                                <button
                                    onClick={() => handleDelete(advice.id)}
                                    className="admin__list-item-button delete"
                                >
                                    🗑️ Supprimer
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Aucun conseil disponible.</p>
                )}
            </div>
        </div>
    );
}
