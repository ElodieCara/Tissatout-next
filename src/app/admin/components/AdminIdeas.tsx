"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Idea {
    id: string;
    title: string;
    description: string;
}

export default function AdminIdeas() {
    const [ideas, setIdeas] = useState<Idea[]>([]);
    const router = useRouter();

    // 🟢 Charger les idées depuis l'API
    useEffect(() => {
        fetch("/api/ideas")
            .then((res) => res.json())
            .then((data) => setIdeas(data))
            .catch((err) => console.error("Erreur lors du chargement des idées :", err));
    }, []);

    // 🟡 Supprimer une idée
    const handleDelete = async (id: string) => {
        if (!confirm("Voulez-vous vraiment supprimer cette idée ?")) return;

        const res = await fetch(`/api/ideas/${id}`, { method: "DELETE" });
        if (res.ok) {
            setIdeas(ideas.filter((idea) => idea.id !== id));
        } else {
            alert("Erreur lors de la suppression de l'idée.");
        }
    };

    return (
        <div className="admin__section">
            <h2>Gestion des Idées 💡</h2>
            <button
                onClick={() => router.push("/admin/ideas/new")}
                className="admin__button"
            >
                ➕ Ajouter une Idée
            </button>
            <div className="admin__list">
                {Array.isArray(ideas) ? (
                    ideas.map((idea) => (
                        <div key={idea.id} className="admin__list-item">
                            <span className="admin__list-item-title">{idea.title}</span>
                            <p className="admin__list-item-description">{idea.description}</p>
                            <div className="admin__list-item-button">
                                <button
                                    onClick={() => router.push(`/admin/ideas/${idea.id}`)}
                                    className="admin__list-item-button edit"
                                >
                                    ✏️ Modifier
                                </button>
                                <button
                                    onClick={() => handleDelete(idea.id)}
                                    className="admin__list-item-button delete"
                                >
                                    🗑️ Supprimer
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Aucune idée disponible.</p>
                )}
            </div>
        </div>
    );
}
