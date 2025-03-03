"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Breadcrumb from "../components/Breadcrumb";

interface DrawingCategory {
    id: string;
    name: string;
    section?: string;
    description?: string;
    iconSrc?: string;
    parentId?: string | null;
}

export default function AdminCategoryList() {
    const [categories, setCategories] = useState<DrawingCategory[]>([]);
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch("/api/drawings/categories")
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setCategories(data);
                } else {
                    console.error("Réponse inattendue:", data);
                    setError("Erreur lors du chargement des catégories.");
                }
            })
            .catch((err) => {
                console.error("Erreur lors du fetch des catégories:", err);
                setError("Impossible de charger les catégories.");
            })
            .finally(() => setLoading(false));
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Voulez-vous vraiment supprimer cette catégorie ?")) return;
        try {
            const res = await fetch(`/api/drawings/categories/${id}`, {
                method: "DELETE",
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Erreur lors de la suppression");
            }
            setCategories((prev) => prev.filter((cat) => cat.id !== id));
        } catch (err: any) {
            alert(err.message);
        }
    };

    return (
        <div className="admin">
            <Breadcrumb />
            <h2 className="admin__title">📂 Liste des catégories</h2>

            <div className="admin__menu">
                <Link href="/admin/category/new">
                    <button className="admin__button">➕ Ajouter une Catégorie</button>
                </Link>
            </div>

            {loading ? (
                <p className="admin__message">⏳ Chargement des catégories...</p>
            ) : error ? (
                <p className="admin__message admin__message--error">❌ {error}</p>
            ) : categories.length === 0 ? (
                <p className="admin__message">Aucune catégorie pour l’instant.</p>
            ) : (
                <ul className="admin__list">
                    {categories.map((cat) => (
                        <li key={cat.id} className="admin__list-item">
                            <div className="admin__list-title">
                                <strong>{cat.name}</strong>
                                {cat.parentId && <span className="admin__badge">Sous-catégorie</span>}
                            </div>

                            <div className="admin__list-actions">
                                <button
                                    className="admin__button admin__button--edit"
                                    onClick={() => router.push(`/admin/category/edit/${cat.id}`)}
                                >
                                    ✏️ Modifier
                                </button>
                                <button
                                    className="admin__button admin__button--delete"
                                    onClick={() => handleDelete(cat.id)}
                                >
                                    🗑️ Supprimer
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
