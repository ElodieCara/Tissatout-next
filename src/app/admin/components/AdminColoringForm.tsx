"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Breadcrumb from "../components/Breadcrumb";
import Link from "next/link";
import { generateSlug } from "@/lib/utils";

interface Coloring {
    id?: string;
    title: string;
    imageUrl: string;
    categoryId: string;
    ageCategories: string[];
    slug?: string;
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
        ageCategories: []
    });

    const [sections, setSections] = useState<Section[]>([]);
    const [categories, setCategories] = useState<CategoriesData>({});
    const [ageCategories, setAgeCategories] = useState<{ id: string; title: string }[]>([]);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    // 🟢 Charger les sections et catégories
    useEffect(() => {
        async function fetchData() {
            try {
                const [sectionsRes, categoriesRes, ageCategoriesRes] = await Promise.all([
                    fetch("/api/drawings/sections"),
                    fetch("/api/drawings/categories"),
                    fetch("/api/ageCategories")
                ]);

                const sectionsData: Section[] = await sectionsRes.json();
                const categoriesData: Category[] = await categoriesRes.json();
                const ageCategoriesData: { id: string; title: string }[] = await ageCategoriesRes.json();

                if (!Array.isArray(sectionsData) || !Array.isArray(categoriesData) || !Array.isArray(ageCategoriesData)) {
                    throw new Error("Données invalides reçues.");
                }

                setSections(sectionsData);
                setAgeCategories(ageCategoriesData);

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

    // 🔄 Chargement des données du coloriage
    useEffect(() => {
        if (!coloringId || coloringId === "new") return;

        async function fetchColoring() {
            try {
                const res = await fetch(`/api/drawings/${coloringId}`);
                const data = await res.json();

                if (!res.ok) {
                    throw new Error("Erreur lors du chargement du coloriage");
                }

                console.log("🎨 Coloriage récupéré :", data);

                setForm({
                    ...data,
                    ageCategories: Array.isArray(data.ageCategories) ? data.ageCategories : [], // ✅ Vérification pour éviter `undefined`
                });

                console.log("📌 Âges récupérés pour affichage :", data.ageCategories);
            } catch (err) {
                console.error("❌ Erreur lors du chargement du coloriage :", err);
                setMessage("❌ Impossible de charger le coloriage.");
            }
        }

        fetchColoring();
    }, [coloringId]);

    // 🟡 Gestion des changements dans le formulaire
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // ✅ Gérer la sélection des catégories d'âge
    const handleAgeCategoryChange = (id: string) => {
        setForm((prev) => {
            const alreadySelected = prev.ageCategories.includes(id);
            const updatedAgeCategories = alreadySelected
                ? prev.ageCategories.filter((ageId) => ageId !== id) // Décocher
                : [...prev.ageCategories, id]; // Cocher

            return {
                ...prev,
                ageCategories: updatedAgeCategories
            };
        });
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
        const slug = generateSlug(form.title, coloringId || crypto.randomUUID());

        try {
            // Log pour débogage
            console.log("📤 Envoi des données:", {
                title: form.title,
                imageUrl: form.imageUrl,
                categoryId: form.categoryId,
                slug,
                ageCategories: form.ageCategories // Envoyer directement le tableau de strings
            });

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: form.title,
                    imageUrl: form.imageUrl,
                    categoryId: form.categoryId,
                    slug,
                    ageCategories: form.ageCategories // Envoi direct du tableau d'IDs
                }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage("✅ Coloriage enregistré !");
                setTimeout(() => router.push("/admin?section=coloring"), 1000);
            } else {
                console.error("❌ Erreur API:", data);
                setMessage(`❌ Erreur: ${data.error || "Erreur lors de l'enregistrement"}`);
            }
        } catch (error) {
            console.error("❌ Exception:", error);
            setMessage("❌ Erreur technique lors de l'enregistrement");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-form">
            <Breadcrumb
                onThemeSelect={(theme) => console.log("Thème sélectionné:", theme)}
                onSubCategorySelect={(subCategory) => console.log("Sous-catégorie sélectionnée:", subCategory)}
            />

            <h2>{coloringId === "new" ? "Ajouter un Coloriage" : "Modifier le Coloriage"}</h2>
            {message && <p className="admin-form__message">{message}</p>}

            <form onSubmit={handleSubmit}>
                {/* 📌 Titre */}
                <div className="admin-form__group">
                    <label htmlFor="title">Titre</label>
                    <input type="text" name="title" value={form.title} onChange={handleChange} required />
                </div>

                {/* ✅ Sélection des âges concernés */}
                <div className="admin-form__group">
                    <label>📌 Âges concernés :</label>
                    <div className="checkbox-group">
                        {ageCategories.map((age) => (
                            <label key={age.id} className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={(form.ageCategories || []).includes(age.id)} // ✅ Sécurisé contre `undefined`
                                    onChange={() => handleAgeCategoryChange(age.id)}
                                />
                                {age.title}
                            </label>
                        ))}
                    </div>
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
                            <button type="button" className="admin-form__button admin-form__button--small">
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