"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Breadcrumb from "../../components/Breadcrumb";

interface Category {
    id: string;
    name: string;
    sectionId?: string | null;
    parentId?: string | null;
}

interface Section {
    id: string;
    name: string;
}

export default function CreateCategoryPage() {
    const [isNewSection, setIsNewSection] = useState(false);
    const [isNewCategory, setIsNewCategory] = useState(false);

    const [section, setSection] = useState("");
    const [newSection, setNewSection] = useState("");
    const [name, setName] = useState("");
    const [newCategoryName, setNewCategoryName] = useState(""); // Ajout du champ

    const [iconSrc, setIconSrc] = useState("");
    const [description, setDescription] = useState("");
    const [parentId, setParentId] = useState("");

    const [sections, setSections] = useState<Section[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    // 🔄 Charger les sections et catégories
    useEffect(() => {
        async function fetchData() {
            try {
                const [sectionsRes, categoriesRes] = await Promise.all([
                    fetch("/api/drawings/sections"),
                    fetch("/api/drawings/categories")
                ]);

                const sectionsData: Section[] = await sectionsRes.json();
                const categoriesData: Category[] = await categoriesRes.json();

                if (!Array.isArray(sectionsData) || !Array.isArray(categoriesData)) {
                    throw new Error("Données invalides reçues.");
                }

                setSections(sectionsData);
                setCategories(categoriesData);
            } catch (err) {
                console.error("❌ Erreur lors du chargement :", err);
                setMessage("❌ Impossible de charger les données.");
            }
        }

        fetchData();
    }, []);

    // 📤 Envoi du formulaire
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");
        setLoading(true);

        // 🛑 Validation stricte
        if (!isNewCategory && !name) {
            setMessage("❌ Le nom de la catégorie est obligatoire.");
            setLoading(false);
            return;
        }

        if (!isNewSection && !section) {
            setMessage("❌ Sélectionnez une section existante ou créez-en une nouvelle.");
            setLoading(false);
            return;
        }

        // 🔍 Trouver l'ID de la section sélectionnée
        const selectedSectionId = isNewSection ? null : sections.find(s => s.name === section)?.id || null;

        try {
            const response = await fetch("/api/drawings/categories", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    sectionId: selectedSectionId,
                    section: isNewSection ? newSection : undefined,
                    name: isNewCategory ? newCategoryName : name,
                    iconSrc,
                    description,
                    parentId: parentId || null,
                }),
            });

            setLoading(false);

            if (response.ok) {
                const newCat = await response.json();
                setMessage(`✅ Catégorie créée: ${newCat.name}`);
                setTimeout(() => router.push("/admin/category"), 1000);
            } else {
                const errorData = await response.json();
                setMessage(`❌ Erreur: ${errorData.error}`);
            }
        } catch (err) {
            console.error(err);
            setMessage("❌ Erreur lors de la création de la catégorie.");
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: "2rem", maxWidth: "600px", margin: "auto" }}>
            <Breadcrumb />
            <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>🆕 Ajouter une Catégorie</h2>
            {message && <p style={{ textAlign: "center", color: message.includes("✅") ? "green" : "red" }}>{message}</p>}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

                {/* Sélection ou création d'une section */}
                <label>📂 Section :</label>
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                    <select
                        value={section}
                        onChange={(e) => setSection(e.target.value)}
                        disabled={isNewSection || sections.length === 0}
                        style={{ flex: 1 }}
                    >
                        <option value="">-- Sélectionner une section --</option>
                        {sections.map((sec) => (
                            <option key={sec.id} value={sec.name}>
                                {sec.name}
                            </option>
                        ))}
                    </select>

                    <button
                        type="button"
                        onClick={() => setIsNewSection(!isNewSection)}
                        style={{ padding: "0.5rem", background: "#007bff", color: "white", borderRadius: "5px", border: "none" }}
                    >
                        ➕ {isNewSection ? "Annuler" : "Nouvelle Section"}
                    </button>
                </div>

                {isNewSection && (
                    <input
                        type="text"
                        value={newSection}
                        onChange={(e) => setNewSection(e.target.value)}
                        placeholder="Ex: Saisons et Fêtes"
                        required
                    />
                )}

                {/* Sélection ou création d'une catégorie */}
                <label>🏷️ Catégorie :</label>
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                    <select
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={isNewCategory || categories.length === 0}
                        style={{ flex: 1 }}
                    >
                        <option value="">-- Sélectionner une catégorie --</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.name}>
                                {cat.name}
                            </option>
                        ))}
                    </select>

                    <button
                        type="button"
                        onClick={() => setIsNewCategory(!isNewCategory)}
                        style={{ padding: "0.5rem", background: "#007bff", color: "white", borderRadius: "5px", border: "none" }}
                    >
                        ➕ {isNewCategory ? "Annuler" : "Nouvelle Catégorie"}
                    </button>
                </div>

                {isNewCategory && (
                    <input
                        type="text"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        placeholder="Ex: Hiver ❄️"
                        required
                    />
                )}

                {/* Bouton de validation */}
                <button type="submit" style={{ padding: "1rem", backgroundColor: "#007bff", color: "#fff", fontSize: "1rem" }} disabled={loading}>
                    {loading ? "⏳ En cours..." : "✅ Créer la catégorie"}
                </button>
            </form>
        </div>
    );
}
