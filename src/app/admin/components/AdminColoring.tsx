"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Drawing } from "@/types/drawing";

export default function AdminColoring() {
    const [drawings, setDrawings] = useState<Drawing[]>([]);
    const router = useRouter();

    // 🟢 Charger les coloriages depuis l'API
    useEffect(() => {
        fetch("/api/drawings")
            .then((res) => res.json())
            .then((data) => setDrawings(data))
            .catch((err) => console.error("Erreur lors du chargement des coloriages :", err));
    }, []);

    // 🟡 Supprimer un coloriage
    const handleDelete = async (id: string) => {
        if (!confirm("Voulez-vous vraiment supprimer ce coloriage ?")) return;

        const res = await fetch(`/api/drawings/${id}`, { method: "DELETE" });
        if (res.ok) {
            setDrawings(drawings.filter((drawing) => drawing.id !== id));
        } else {
            alert("Erreur lors de la suppression du coloriage.");
        }
    };

    return (
        <div className="admin__section">
            <h2>Gestion des Coloriages 🎨</h2>
            <button
                onClick={() => router.push("/admin/coloring/new")}
                className="admin__button"
            >
                ➕ Ajouter un Coloriage
            </button>
            <div className="admin__list">
                {Array.isArray(drawings) ? (
                    drawings.map((drawing) => (
                        <div key={drawing.id} className="admin__list-item">
                            {drawing.imageUrl && <img src={drawing.imageUrl} alt={drawing.title} width="80" />}
                            <span className="admin__list-item-title">{drawing.title}</span>
                            <div className="admin__list-item-button">
                                <button
                                    onClick={() => router.push(`/admin/coloring/${drawing.id}`)}
                                    className="admin__list-item-button edit"
                                >
                                    ✏️ Modifier
                                </button>
                                <button
                                    onClick={() => handleDelete(drawing.id)}
                                    className="admin__list-item-button delete"
                                >
                                    🗑️ Supprimer
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Aucun coloriage disponible.</p>
                )}
            </div>
        </div>
    );
}
