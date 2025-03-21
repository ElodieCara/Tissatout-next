"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface AgeCategory {
    id: string;
    title: string;
    slug: string;
    description: string;
    imageCard: string;
    imageBanner: string;
}

export default function AdminAgeCategory() {
    const [categories, setCategories] = useState<AgeCategory[]>([]);
    const [message, setMessage] = useState("");
    const router = useRouter();

    useEffect(() => {
        fetch("/api/ageCategories")
            .then((res) => res.json())
            .then((data) => setCategories(data))
            .catch(() => setMessage("❌ Erreur lors du chargement des catégories."));
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Confirmer la suppression ?")) return;
        const res = await fetch(`/api/ageCategory/${id}`, { method: "DELETE" });
        if (res.ok) {
            setCategories((prev) => prev.filter((cat) => cat.id !== id));
            setMessage("✅ Catégorie supprimée.");
        } else {
            setMessage("❌ Erreur lors de la suppression.");
        }
    };

    return (
        <div className="admin">
            <h2>🧒 Catégories d'âge</h2>

            <button className="admin__button" onClick={() => router.push("/admin/ageCategory/new")}>
                ➕ Ajouter une catégorie
            </button>

            {message && <p className="admin-form__message">{message}</p>}

            <div className="admin__list">
                <h3 className="admin__list-title">📋 Liste des catégories</h3>

                {categories.length > 0 ? (
                    categories.map((cat) => (
                        <div key={cat.id} className="admin__list-item">
                            <img
                                src={cat.imageCard || "/images/placeholder.jpg"}
                                alt={cat.title}
                                className="admin__list-item-image"
                            />
                            <div>
                                <p className="admin__list-item-title">{cat.title}</p>
                                <p>{cat.description}</p>
                                <small>Slug : {cat.slug}</small>
                            </div>
                            <div>
                                <button
                                    className="admin__list-item-button edit"
                                    onClick={() => router.push(`/admin/ageCategory/${cat.id}`)}
                                >
                                    ✏️ Modifier
                                </button>
                                <button
                                    className="admin__list-item-button delete"
                                    onClick={() => handleDelete(cat.id)}
                                >
                                    🗑️ Supprimer
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Aucune catégorie trouvée.</p>
                )}
            </div>
        </div>
    );
}
