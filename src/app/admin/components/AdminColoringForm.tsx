"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Breadcrumb from "./Breadcrumb";
import Link from "next/link";

interface Coloring {
    id?: string;
    title: string;
    imageUrl: string;
    categoryId: string;
}

interface Category {
    id: string;
    name: string;
    sectionId: string;
}

interface Section {
    id: string;
    name: string;
}

// ✅ Définition du type des catégories par section
type CategoriesData = Record<string, Category[]>;

export default function AdminColoringForm({ coloringId }: { coloringId?: string }) {
    const [form, setForm] = useState<Coloring>({
        title: "",
        imageUrl: "",
        categoryId: "",
    });

    const [sections, setSections] = useState<Section[]>([]);
    const [categories, setCategories] = useState<CategoriesData>({});
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    // 🟢 Charger les sections et catégories
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

                // ✅ Organiser les catégories par section
                const categorizedData: CategoriesData = {};
                sectionsData.forEach((section) => {
                    categorizedData[section.id] = categoriesData.filter(cat => cat.sectionId === section.id);
                });

                setCategories(categorizedData);
            } catch (err) {
                console.error("❌ Erreur lors du chargement :", err);
                setMessage("❌ Impossible de charger les données.");
            }
        }

        fetchData();
    }, []);

    // 🟡 Gestion des changements dans le formulaire
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // 📸 Gérer l'upload d'image
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();

        if (res.ok) {
            setForm((prev) => ({ ...prev, imageUrl: data.imageUrl }));
            setMessage("✅ Image uploadée !");
        } else {
            setMessage("❌ Erreur lors de l'upload.");
        }
    };

    // 📤 Envoyer le formulaire (création/modification)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");
        setLoading(true);

        const method = coloringId && coloringId !== "new" ? "PUT" : "POST";
        const url = coloringId && coloringId !== "new" ? `/api/drawings/${coloringId}` : "/api/drawings";

        const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });

        setLoading(false);

        if (res.ok) {
            setMessage("✅ Coloriage enregistré !");
            setTimeout(() => router.push("/admin?section=coloring"), 1000);
        } else {
            setMessage("❌ Erreur lors de l'enregistrement.");
        }
    };

    return (
        <div className="admin-form">
            <Breadcrumb />
            <h2>{coloringId === "new" ? "Ajouter un Coloriage" : "Modifier le Coloriage"}</h2>
            {message && <p className="admin-form__message">{message}</p>}

            <form onSubmit={handleSubmit}>
                {/* 📌 Titre */}
                <div className="admin-form__group">
                    <label htmlFor="title">Titre</label>
                    <input type="text" name="title" value={form.title} onChange={handleChange} required />
                </div>

                {/* 📌 Sélection de la section et sous-catégorie */}
                <div className="admin-form__group">
                    <label htmlFor="categoryId">Catégorie</label>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        <select name="categoryId" value={form.categoryId} onChange={handleChange} required>
                            <option value="">Sélectionner une catégorie</option>
                            {sections.map((section) => (
                                <optgroup key={section.id} label={section.name}>
                                    {categories[section.id]?.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </optgroup>
                            ))}
                        </select>

                        {/* 🔗 Bouton pour ajouter une catégorie */}
                        <Link href="/admin/category/new">
                            <button type="button" style={{ cursor: "pointer", padding: "6px 10px", background: "#007bff", color: "white", border: "none", borderRadius: "5px" }}>
                                +
                            </button>
                        </Link>
                    </div>
                </div>

                {/* 📌 Upload d'image */}
                <div className="admin-form__upload">
                    <label htmlFor="imageUpload">📸 Image</label>
                    <input type="file" accept="image/*" onChange={handleImageUpload} />
                    {form.imageUrl && (
                        <div className="admin-form__upload-preview">
                            <img src={form.imageUrl} alt="Aperçu" />
                        </div>
                    )}
                </div>

                {/* 📌 Bouton d'envoi */}
                <button type="submit" className="admin-form__button" disabled={loading}>
                    {loading ? "⏳ En cours..." : (coloringId === "new" ? "Ajouter" : "Mettre à jour")}
                </button>
            </form>
        </div>
    );
}
