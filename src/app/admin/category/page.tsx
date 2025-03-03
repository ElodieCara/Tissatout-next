"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Breadcrumb from "../components/Breadcrumb";

interface DrawingCategory {
    id: string;
    name: string;
    sectionId?: string;
    description?: string;
    iconSrc?: string;
    parentId?: string | null;
}

interface Section {
    id: string;
    name: string;
}

export default function AdminCategoryList() {
    const [categories, setCategories] = useState<DrawingCategory[]>([]);
    const [sections, setSections] = useState<Section[]>([]);
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const [categoriesRes, sectionsRes] = await Promise.all([
                    fetch("/api/drawings/categories"),
                    fetch("/api/drawings/sections")
                ]);

                const categoriesData = await categoriesRes.json();
                const sectionsData = await sectionsRes.json();

                setCategories(categoriesData);
                setSections(sectionsData);
            } catch (err) {
                console.error("Erreur lors du fetch des données:", err);
                setError("Impossible de charger les catégories et sections.");
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    const handleDeleteCategory = async (id: string) => {
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

    const handleDeleteSection = async (id: string) => {
        if (!confirm("Cette section peut contenir des catégories. Voulez-vous vraiment la supprimer ?")) return;
        try {
            const res = await fetch(`/api/drawings/sections/${id}`, {
                method: "DELETE",
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Erreur lors de la suppression");
            }
            setSections((prev) => prev.filter((sec) => sec.id !== id));
        } catch (err: any) {
            alert(err.message);
        }
    };

    return (
        <div className="admin">
            <Breadcrumb />
            <h2 className="admin__title">📂 Liste des sections et catégories</h2>

            <div className="admin__menu">
                <Link href="/admin/category/new">
                    <button className="admin__button">➕ Ajouter une Catégorie ou une Section</button>
                </Link>
            </div>

            {loading ? (
                <p className="admin__message">⏳ Chargement des sections et catégories...</p>
            ) : error ? (
                <p className="admin__message admin__message--error">❌ {error}</p>
            ) : (
                <>
                    <h3 className="admin__subtitle">📂 Sections</h3>
                    <ul className="admin__list">
                        {sections.map((sec) => (
                            <li key={sec.id} className="admin__list-item">
                                <div className="admin__list-title">
                                    <strong>{sec.name}</strong>
                                </div>
                                <div className="admin__list-actions">
                                    <button
                                        className="admin__button admin__button--edit"
                                        onClick={() => router.push(`/admin/section/edit/${sec.id}`)}
                                    >
                                        ✏️ Modifier
                                    </button>
                                    <button
                                        className="admin__button admin__button--delete"
                                        onClick={() => handleDeleteSection(sec.id)}
                                    >
                                        🗑️ Supprimer
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>

                    <h3 className="admin__subtitle">🏷️ Catégories</h3>
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
                                        onClick={() => handleDeleteCategory(cat.id)}
                                    >
                                        🗑️ Supprimer
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
}
