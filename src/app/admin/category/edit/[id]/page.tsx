"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditCategoryPage() {
    const [name, setName] = useState("");
    const [section, setSection] = useState("");
    const [description, setDescription] = useState("");
    const [iconSrc, setIconSrc] = useState("");
    const [parentId, setParentId] = useState("");

    const [allCats, setAllCats] = useState<any[]>([]);

    const [message, setMessage] = useState("");

    const router = useRouter();
    const params = useParams();

    // Si tu souhaites stopper le composant si params est null ou s’il n’y a pas d’ID
    if (!params || !params.id) {
        return <div>Impossible de charger l’ID.</div>;
    }

    const categoryId = params.id;


    // 1. Charger la catégorie à éditer
    useEffect(() => {
        if (!categoryId) return;
        fetch(`/api/drawings/categories/${categoryId}`)
            .then((res) => res.json())
            .then((cat) => {
                if (cat.error) {
                    setMessage(cat.error);
                    return;
                }
                setName(cat.name || "");
                setSection(cat.section || "");
                setDescription(cat.description || "");
                setIconSrc(cat.iconSrc || "");
                setParentId(cat.parentId || "");
            })
            .catch((err) => console.error("Erreur fetch cat:", err));
    }, [categoryId]);

    // 2. Charger toutes les catégories pour choisir un parent
    useEffect(() => {
        fetch("/api/drawings/categories")
            .then((res) => res.json())
            .then((data) => {
                setAllCats(data);
            })
            .catch((err) => console.error("Erreur fetch all cats:", err));
    }, []);

    // 3. Mettre à jour
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch(`/api/drawings/categories/${categoryId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    section,
                    description,
                    iconSrc,
                    parentId: parentId || null,
                }),
            });
            const data = await res.json();
            if (!res.ok) {
                setMessage(`Erreur: ${data.error}`);
            } else {
                setMessage("Catégorie mise à jour avec succès !");
                setTimeout(() => router.push("/admin/category"), 1000);
            }
        } catch (err) {
            console.error(err);
            setMessage("Erreur lors de la mise à jour.");
        }
    };

    return (
        <div style={{ padding: "1rem" }}>
            <h2>Modifier la catégorie</h2>
            {message && <p>{message}</p>}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <label>
                    Nom :
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </label>

                <label>
                    Section :
                    <select value={section} onChange={(e) => setSection(e.target.value)}>
                        <option value="">-- Section --</option>
                        <option value="Saisons et Fêtes">Saisons et Fêtes</option>
                        <option value="Thèmes">Thèmes</option>
                        <option value="Âge">Âge</option>
                        <option value="Éducatif & Trivium">Éducatif & Trivium</option>
                    </select>
                </label>

                <button type="submit">Enregistrer</button>
            </form>
        </div>
    );
}
