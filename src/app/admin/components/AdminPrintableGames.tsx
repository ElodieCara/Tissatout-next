"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface PrintableGame {
    id: string;
    title: string;
    imageUrl?: string;
    isMystery: boolean;
    mysteryUntil: string | null;
}

export default function AdminPrintableGames() {
    const [games, setGames] = useState<PrintableGame[]>([]);
    const router = useRouter();

    useEffect(() => {
        fetch("/api/printable") // ⚠️ à créer aussi côté API
            .then((res) => res.json())
            .then((data) => setGames(data));
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Supprimer cette activité ?")) return;

        const res = await fetch(`/api/printable/${id}`, { method: "DELETE" });
        if (res.ok) {
            setGames(games.filter((g) => g.id !== id));
        }
    };

    return (
        <div className="admin__section">
            <h2>📂 Activités à imprimer</h2>
            <button onClick={() => router.push("/admin/printable/new")} className="admin__button">
                ➕ Ajouter une activité
            </button>

            <div className="admin__list">
                {Array.isArray(games) ? (
                    games.map((game) => (
                        <div key={game.id} className="admin__list-item">
                            {game.imageUrl && <img src={game.imageUrl} alt={game.title} width="80" />}
                            <span>{game.title}</span>
                            {game.isMystery && (
                                <span className="admin__list-item-tag">
                                    🎭 Mystère jusqu’au{' '}
                                    {new Date(game.mysteryUntil!).toLocaleDateString('fr-FR', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric'
                                    })}
                                </span>
                            )}
                            <div className="admin__list-item-button">
                                <button onClick={() => router.push(`/admin/printable/${game.id}`)}>✏️ Modifier</button>
                                <button onClick={() => handleDelete(game.id)}>🗑️ Supprimer</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Aucune activité disponible.</p>
                )}
            </div>
        </div>
    );
}
