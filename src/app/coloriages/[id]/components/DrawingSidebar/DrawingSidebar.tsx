"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Drawing } from "@/types/drawing";

interface DrawingSidebarProps {
    category: string;
    currentDrawingId: string;
}

export default function DrawingSidebar({ category, currentDrawingId }: DrawingSidebarProps) {
    const [similarDrawings, setSimilarDrawings] = useState<Drawing[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSimilarDrawings = async () => {
            try {
                console.log("🔍 Récupération des coloriages pour la catégorie :", category);

                const res = await fetch(`/api/drawings?category=${encodeURIComponent(category)}&limit=6`);
                if (!res.ok) {
                    throw new Error("Erreur lors du chargement des coloriages similaires");
                }
                const data = await res.json();

                console.log("✅ Résultat API :", data);

                // Exclure le coloriage actuel UNIQUEMENT s'il y a d'autres dessins
                const filteredDrawings = data.length > 1 ? data.filter((drawing: Drawing) => drawing.id !== currentDrawingId) : data;
                setSimilarDrawings(filteredDrawings);
            } catch (err) {
                console.error("❌ Erreur API :", err);
                setError("Impossible de charger les coloriages similaires.");
            } finally {
                setLoading(false);
            }
        };

        fetchSimilarDrawings();
    }, [category, currentDrawingId]);

    return (
        <aside className="drawing-sidebar">
            <h3 className="drawing-sidebar__title">📜 Autres coloriages dans {category}</h3>

            {loading && <p className="drawing-sidebar--loading">Chargement...</p>}
            {error && <p className="drawing-sidebar--error">{error}</p>}

            <ul className="drawing-sidebar__list">
                {similarDrawings.map((drawing) => (
                    <li key={drawing.id} className="drawing-sidebar__item">
                        <Link href={`/coloriages/${drawing.id}`}>
                            <div className="drawing-sidebar__card">
                                <Image
                                    src={drawing.imageUrl}
                                    alt={drawing.title}
                                    width={50}
                                    height={50}
                                    className="drawing-sidebar__image"
                                    loading="lazy"
                                />
                                <span className="drawing-sidebar__title">{drawing.title}</span>
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
        </aside>

    );
}
