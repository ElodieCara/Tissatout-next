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
    // children?: DrawingCategory[]; // si tu veux la hiérarchie
}

export default function AdminCategoryList() {
    const [categories, setCategories] = useState<DrawingCategory[]>([]);
    const router = useRouter();

    // Charger les catégories
    useEffect(() => {
        fetch("/api/drawings/categories")
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setCategories(data);
                } else {
                    console.error("Réponse inattendue:", data);
                }
            })
            .catch((err) => {
                console.error("Erreur lors du fetch des catégories:", err);
            });
    }, []);

    // Supprimer
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
            // Retirer la catégorie du state
            setCategories((prev) => prev.filter((cat) => cat.id !== id));
        } catch (err: any) {
            alert(err.message);
        }
    };

    // Render
    return (
        <div style={{ padding: "2rem" }}>
            <Breadcrumb />
            <h1>Liste des catégories</h1>

            {/* Bouton pour créer une nouvelle catégorie racine */}
            <Link href="/admin/category/new">
                <button style={{ marginBottom: "1rem" }}>+ Ajouter une Catégorie</button>
            </Link>

            {categories.length === 0 ? (
                <p>Aucune catégorie pour l’instant.</p>
            ) : (
                <ul style={{ listStyle: "none", paddingLeft: 0 }}>
                    {categories.map((cat) => (
                        <li key={cat.id} style={{ marginBottom: "1rem" }}>
                            <strong>{cat.name}</strong>
                            {cat.parentId && <span> (sous-catégorie)</span>}


                            <div style={{ marginTop: "0.5rem" }}>
                                <button onClick={() => router.push(`/admin/category/edit/${cat.id}`)}>
                                    ✏️ Modifier
                                </button>
                                <button
                                    onClick={() => handleDelete(cat.id)}
                                    style={{ marginLeft: "0.5rem" }}
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
