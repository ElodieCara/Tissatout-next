"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Theme {
    id: string;
    label: string;
}

export default function AdminThemesPage() {
    const [themes, setThemes] = useState<Theme[]>([]);
    const [newLabel, setNewLabel] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchThemes = async () => {
            const res = await fetch("/api/themes");
            const data = await res.json();
            setThemes(data);
        };
        fetchThemes();
    }, []);

    const handleAdd = async () => {
        if (!newLabel.trim()) return;
        setLoading(true);
        const res = await fetch("/api/themes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ label: newLabel.trim() }),
        });
        if (res.ok) {
            const data = await res.json();
            setThemes((prev) => [...prev, data]);
            setNewLabel("");
        }
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        const confirmDelete = confirm("Supprimer ce thème ?");
        if (!confirmDelete) return;

        const res = await fetch(`/api/themes/${id}`, { method: "DELETE" });
        const data = await res.json();
        if (res.ok) {
            setThemes((prev) => prev.filter((t) => t.id !== id));
        } else {
            alert(data.message);
        }
    };

    return (
        <div className="admin-themes">
            <h2>Gestion des Types</h2>

            <div className="admin-themes__add">
                <input
                    type="text"
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                    placeholder="Nouveau types"
                />
                <button onClick={handleAdd} disabled={loading}>
                    Ajouter
                </button>
            </div>

            <ul className="admin-themes__list">
                {themes.map((theme) => (
                    <li key={theme.id} className="admin-themes__item">
                        {theme.label}
                        <button onClick={() => handleDelete(theme.id)}>🗑️</button>
                    </li>
                ))}
            </ul>

            <Link href="/admin">← Retour à l'administration</Link>
        </div>
    );
}
