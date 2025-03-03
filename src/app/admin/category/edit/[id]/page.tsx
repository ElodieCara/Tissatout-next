"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface Section {
    id: string;
    name: string;
}

interface Category {
    id: string;
    name: string;
    sectionId?: string;
    description?: string;
    iconSrc?: string;
    parentId?: string | null;
}

export default function EditCategoryPage() {
    const [name, setName] = useState("");
    const [sectionId, setSectionId] = useState(""); // 🔥 Stocke l'ID au lieu du nom
    const [description, setDescription] = useState("");
    const [iconSrc, setIconSrc] = useState("");
    const [parentId, setParentId] = useState("");

    const [sections, setSections] = useState<Section[]>([]);
    const [allCats, setAllCats] = useState<Category[]>([]);
    const [message, setMessage] = useState("");

    const router = useRouter();
    const params = useParams();

    if (!params || !params.id) {
        return <div>Impossible de charger l’ID.</div>;
    }

    const categoryId = params.id as string;

    // 🔍 Charger la catégorie à éditer
    useEffect(() => {
        async function fetchCategory() {
            try {
                const res = await fetch(`/api/drawings/categories/${categoryId}`);
                const cat: Category | { error: string } = await res.json();

                if ("error" in cat) {
                    setMessage(cat.error);
                    return;
                }

                setName(cat.name || "");
                setSectionId(cat.sectionId || ""); // ✅ Récupère l'ID de la section
                setDescription(cat.description || "");
                setIconSrc(cat.iconSrc || "");
                setParentId(cat.parentId || "");
            } catch (err) {
                console.error("Erreur fetch catégorie:", err);
                setMessage("Erreur lors du chargement de la catégorie.");
            }
        }

        fetchCategory();
    }, [categoryId]);

    // 🔍 Charger toutes les sections et catégories
    useEffect(() => {
        async function fetchData() {
            try {
                // Récupère les **sections** dynamiques
                const resSections = await fetch("/api/drawings/sections");
                const sectionsData = await resSections.json();
                setSections(sectionsData);

                // Récupère les **catégories**
                const resCats = await fetch("/api/drawings/categories");
                const categoriesData = await resCats.json();
                setAllCats(categoriesData);
            } catch (err) {
                console.error("Erreur fetch données:", err);
            }
        }
        fetchData();
    }, []);

    // ✅ Mettre à jour la catégorie
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch(`/api/drawings/categories/${categoryId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    sectionId, // ✅ Envoie l'ID de la section au lieu du nom
                    description,
                    iconSrc,
                    parentId: parentId || null,
                }),
            });

            const data = await res.json();
            if (!res.ok) {
                setMessage(`Erreur: ${data.error}`);
            } else {
                setMessage("✅ Catégorie mise à jour avec succès !");
                setTimeout(() => router.push("/admin/category"), 1000);
            }
        } catch (err) {
            console.error(err);
            setMessage("❌ Erreur lors de la mise à jour.");
        }
    };

    return (
        <div style={{ padding: "1rem", maxWidth: "600px", margin: "auto" }}>
            <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>📝 Modifier la catégorie</h2>
            {message && <p style={{ textAlign: "center", color: message.includes("✅") ? "green" : "red" }}>{message}</p>}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {/* 🏷️ Nom */}
                <label>🏷️ Nom :</label>
                <input value={name} onChange={(e) => setName(e.target.value)} required />

                {/* 📂 Section */}
                <label>📂 Section :</label>
                <select value={sectionId} onChange={(e) => setSectionId(e.target.value)} required>
                    <option value="">-- Sélectionner une section --</option>
                    {sections.map((sec) => (
                        <option key={sec.id} value={sec.id}>
                            {sec.name}
                        </option>
                    ))}
                </select>

                {/* 🖼️ Icône */}
                <label>🖼️ Icône (URL) :</label>
                <input value={iconSrc} onChange={(e) => setIconSrc(e.target.value)} />

                {/* 📝 Description */}
                <label>📝 Description :</label>
                <input value={description} onChange={(e) => setDescription(e.target.value)} />

                {/* 📂 Parent (optionnel) */}
                <label>📂 Sous-catégorie :</label>
                <select value={parentId} onChange={(e) => setParentId(e.target.value)}>
                    <option value="">-- Aucune (catégorie principale) --</option>
                    {allCats
                        .filter((cat) => cat.id !== categoryId) // Empêche d’être son propre parent
                        .map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                </select>

                <button type="submit" style={{ padding: "1rem", backgroundColor: "#007bff", color: "#fff", fontSize: "1rem" }}>
                    ✅ Enregistrer
                </button>
            </form>
        </div>
    );
}
