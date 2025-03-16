"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
    const [newCategoryName, setNewCategoryName] = useState("");
    const [iconSrc, setIconSrc] = useState("");
    const [description, setDescription] = useState("");
    const [parentId, setParentId] = useState("");

    const [sections, setSections] = useState<Section[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    useEffect(() => {
        async function fetchData() {
            try {
                const [sectionsRes, categoriesRes] = await Promise.all([
                    fetch("/api/drawings/sections"),
                    fetch("/api/drawings/categories")
                ]);
                const sectionsData: Section[] = await sectionsRes.json();
                const categoriesData: Category[] = await categoriesRes.json();
                setSections(sectionsData);
                setCategories(categoriesData);
            } catch (err) {
                setMessage("❌ Impossible de charger les données.");
            }
        }
        fetchData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");
        setLoading(true);

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
            setMessage("❌ Erreur lors de la création de la catégorie.");
            setLoading(false);
        }
    };

    return (
        <div className="admin-form">
            <Breadcrumb
                onThemeSelect={(theme) => console.log("Thème sélectionné:", theme)}
                onSubCategorySelect={(subCategory) => console.log("Sous-catégorie sélectionnée:", subCategory)}
            />

            <h2 className="admin-form__title">Ajouter une Catégorie/Section</h2>

            <button onClick={() => router.push("/admin/category")} className="admin-form__button admin-form__button--primary">
                📂 Voir toutes les catégories/sections
            </button>

            {message && <p className="admin-form__message">{message}</p>}

            <form onSubmit={handleSubmit} className="admin-form__container">
                <div className="admin-form__group">
                    <label>📂 Section :</label>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        <select value={section} onChange={(e) => setSection(e.target.value)} disabled={isNewSection || sections.length === 0} className="admin-form__select">
                            <option value="">-- Sélectionner une section --</option>
                            {sections.map((sec) => (
                                <option key={sec.id} value={sec.name}>{sec.name}</option>
                            ))}
                        </select>
                        <button type="button" onClick={() => setIsNewSection(!isNewSection)} className="admin-form__button admin-form__button--small">+</button>
                    </div>
                </div>

                {isNewSection && (
                    <input type="text" value={newSection} onChange={(e) => setNewSection(e.target.value)} placeholder="Ex: Saisons et Fêtes" required className="admin-form__input" style={{ flex: "1", padding: "0.75rem", borderRadius: "8px", border: "1px solid #ddd" }} />
                )}

                <div className="admin-form__group">
                    <label>🏷️ Catégorie :</label>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        <select value={name} onChange={(e) => setName(e.target.value)} disabled={isNewCategory || categories.length === 0} className="admin-form__select">
                            <option value="">-- Sélectionner une catégorie --</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.name}>{cat.name}</option>
                            ))}
                        </select>
                        <button type="button" onClick={() => setIsNewCategory(!isNewCategory)} className="admin-form__button admin-form__button--small">+</button>
                    </div>
                </div>

                {isNewCategory && (
                    <input type="text" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} placeholder="Ex: Hiver ❄️" required className="admin-form__input" style={{ flex: "1", padding: "0.75rem", borderRadius: "8px", border: "1px solid #ddd" }} />
                )}
                <div style={{ width: "100%", marginTop: "1rem" }}>
                    <button type="submit" className="admin-form__button admin-form__button--yellow" disabled={loading}>
                        {loading ? "⏳ En cours..." : "✅ Créer "}
                    </button>
                </div>
            </form >
        </div >
    );
}