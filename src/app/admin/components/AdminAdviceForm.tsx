// ✅ FILE: AdminAdviceForm.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { generateSlug } from "@/lib/utils";
import Breadcrumb from "./Breadcrumb";

interface Advice {
    id?: string;
    title: string;
    content: string;
    category: string;
    description?: string;
    imageUrl?: string;
    ageCategories?: string[];
    slug?: string;
}

export default function AdminAdviceForm({ adviceId }: { adviceId?: string }) {
    const [form, setForm] = useState<Advice>({
        title: "",
        content: "",
        category: "",
        description: "",
        imageUrl: "",
        ageCategories: [],
    });

    const [message, setMessage] = useState("");
    const router = useRouter();
    const [ageCategories, setAgeCategories] = useState<{ id: string; title: string }[]>([]);

    useEffect(() => {
        if (adviceId && adviceId !== "new") {
            fetch(`/api/advice/${adviceId}`)
                .then((res) => res.json())
                .then((data) => {
                    setForm({
                        ...data,
                        ageCategories: Array.isArray(data.ageCategories) ? data.ageCategories : [],
                    });
                })
                .catch(() => setMessage("❌ Impossible de charger le conseil."));
        }

        fetch("/api/ageCategories")
            .then(res => res.json())
            .then(data => setAgeCategories(data));
    }, [adviceId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleAgeCategoryChange = (id: string) => {
        setForm((prev) => {
            const alreadySelected = prev.ageCategories?.includes(id);
            return {
                ...prev,
                ageCategories: alreadySelected
                    ? prev.ageCategories?.filter((ageId) => ageId !== id)
                    : [...(prev.ageCategories || []), id],
            };
        });
    };

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const method = adviceId && adviceId !== "new" ? "PUT" : "POST";
        const url = adviceId && adviceId !== "new" ? `/api/advice/${adviceId}` : "/api/advice";

        const safeId = crypto.randomUUID().slice(0, 6);
        const slug = generateSlug(form.title, safeId);

        const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ...form,
                slug,
                ageCategories: form.ageCategories || [],
            }),
        });

        const data = await res.json();

        if (res.ok) {
            setMessage("✅ Conseil enregistré !");
            setTimeout(() => router.push("/admin?section=advice"), 1000);
        } else {
            console.error("❌ Erreur :", data);
            setMessage(`❌ Erreur : ${data.error || "Erreur inconnue"}`);
        }
    };

    return (
        <div className="admin-form">
            <Breadcrumb
                onThemeSelect={(theme) => console.log("Thème sélectionné:", theme)}
                onSubCategorySelect={(subCategory) => console.log("Sous-catégorie sélectionnée:", subCategory)}
            />

            <h2>{adviceId === "new" ? "Ajouter un Conseil" : "Modifier le Conseil"}</h2>
            {message && <p className="admin-form__message">{message}</p>}

            <form onSubmit={handleSubmit}>
                <div className="admin-form__group">
                    <label htmlFor="title">Titre</label>
                    <input type="text" name="title" value={form.title} onChange={handleChange} required />
                </div>

                <div className="admin-form__group">
                    <label htmlFor="description">Description</label>
                    <textarea name="description" value={form.description} onChange={handleChange} />
                </div>

                <div className="admin-form__group">
                    <label htmlFor="content">Contenu</label>
                    <textarea name="content" value={form.content} onChange={handleChange} required />
                </div>

                <div className="admin-form__group">
                    <label htmlFor="category">Catégorie</label>
                    <select name="category" value={form.category} onChange={handleChange} required>
                        <option value="">Sélectionner une catégorie</option>
                        <option value="savoirs">📚 Savoirs & Lettres</option>
                        <option value="harmonie">🎶 Harmonie & Discipline</option>
                        <option value="eloquence">🏰 Rhétorique & Expression</option>
                    </select>
                </div>

                <div className="admin-form__group">
                    <label>📌 Âges concernés :</label>
                    <div className="checkbox-group">
                        {ageCategories.map((age) => (
                            <label key={age.id} className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={form.ageCategories?.includes(age.id)}
                                    onChange={() => handleAgeCategoryChange(age.id)}
                                />
                                {age.title}
                            </label>
                        ))}
                    </div>
                </div>

                <div className="admin-form__upload">
                    <label htmlFor="imageUpload">📸 Image</label>
                    <input type="file" accept="image/*" onChange={handleImageUpload} />
                    {form.imageUrl && (
                        <div className="admin-form__upload-preview">
                            <img src={form.imageUrl} alt="Aperçu" />
                        </div>
                    )}
                </div>

                <button type="submit" className="admin-form__button">
                    {adviceId === "new" ? "Ajouter" : "Mettre à jour"}
                </button>
            </form>
        </div>
    );
}
