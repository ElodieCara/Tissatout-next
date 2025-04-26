// ✅ FILE FINALISÉ : AdminAdviceForm.tsx (avec sections ajoutées)
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { generateSlug } from "@/lib/utils";
import Breadcrumb from "../components/Breadcrumb";
import ReactMarkdown from "react-markdown";

interface Section {
    title: string;
    content: string;
    style?: string;
}

interface Advice {
    id?: string;
    title: string;
    content?: string;
    description?: string;
    imageUrl?: string;
    category: string;
    ageCategories?: string[];
    slug?: string;
    sections: Section[];
}

export default function AdminAdviceForm({ adviceId }: { adviceId?: string }) {
    const [form, setForm] = useState<Advice>({
        title: "",
        content: "",
        description: "",
        category: "",
        imageUrl: "",
        ageCategories: [],
        sections: [{ title: "", content: "", style: "" }],
    });

    const [message, setMessage] = useState("");
    const router = useRouter();
    const [ageCategories, setAgeCategories] = useState<{ id: string; title: string }[]>([]);

    useEffect(() => {
        async function fetchData() {
            if (adviceId && adviceId !== "new") {
                const res = await fetch(`/api/advice/${adviceId}`);
                const data = await res.json();
                setForm({
                    ...data,
                    ageCategories: Array.isArray(data.ageCategories) ? data.ageCategories : [],
                    sections: Array.isArray(data.sections) && data.sections.length > 0 ? data.sections : [{ title: "", content: "", style: "" }],
                });
            }
            const resAge = await fetch("/api/ageCategories");
            const ageData = await resAge.json();
            setAgeCategories(ageData);
        }
        fetchData();
    }, [adviceId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleAgeCategoryChange = (id: string) => {
        setForm(prev => ({
            ...prev,
            ageCategories: prev.ageCategories?.includes(id)
                ? prev.ageCategories.filter(a => a !== id)
                : [...(prev.ageCategories || []), id],
        }));
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();

        if (res.ok) setForm(prev => ({ ...prev, imageUrl: data.imageUrl }));
        else setMessage("❌ Erreur lors de l'upload");
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
                sections: form.sections.map(s => ({
                    title: s.title,
                    content: s.content,
                    style: s.style || "classique",
                })),
            }),
        });

        if (res.ok) {
            setMessage("✅ Conseil enregistré !");
            setTimeout(() => router.push("/admin?section=advice"), 1000);
        } else {
            const data = await res.json();
            setMessage(`❌ Erreur : ${data.error || "Erreur inconnue"}`);
        }
    };

    const addSection = () => {
        setForm(prev => ({
            ...prev,
            sections: [...prev.sections, { title: "", content: "", style: "" }]
        }));
    };

    const updateSection = (index: number, field: keyof Section, value: string) => {
        const updated = [...form.sections];
        updated[index][field] = value;
        setForm({ ...form, sections: updated });
    };

    const removeSection = (index: number) => {
        const updated = [...form.sections];
        updated.splice(index, 1);
        setForm({ ...form, sections: updated });
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
                    <label>Titre</label>
                    <input name="title" value={form.title} onChange={handleChange} required />
                </div>

                <div className="admin-form__group">
                    <label>Description</label>
                    <textarea name="description" value={form.description} onChange={handleChange} />
                </div>

                <div className="admin-form__group">
                    <label>Texte d'introduction</label>
                    <textarea name="content" value={form.content} onChange={handleChange} />
                </div>

                <div className="admin-form__group">
                    <label>Catégorie</label>
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
                        {ageCategories.map(age => (
                            <label key={age.id}>
                                <input type="checkbox" checked={form.ageCategories?.includes(age.id)} onChange={() => handleAgeCategoryChange(age.id)} /> {age.title}
                            </label>
                        ))}
                    </div>
                </div>

                <div className="admin-form__upload">
                    <label>📸 Image</label>
                    <input type="file" accept="image/*" onChange={handleImageUpload} />
                    {form.imageUrl && <img src={form.imageUrl} alt="Aperçu" />}
                </div>

                {/* Gestion des sections */}
                <div className="admin-form__group">
                    <label>Sections</label>
                    {form.sections.map((section, index) => (
                        <div key={index} className="admin-form__section">
                            <input placeholder="Titre de section" value={section.title} onChange={e => updateSection(index, "title", e.target.value)} />
                            <textarea placeholder="Contenu" value={section.content} onChange={e => updateSection(index, "content", e.target.value)} />
                            <select value={section.style || ""} onChange={e => updateSection(index, "style", e.target.value)}>
                                <option value="">Classique</option>
                                <option value="highlight">Fond coloré</option>
                                <option value="icon">Avec icône</option>
                            </select>
                            <button type="button" onClick={() => removeSection(index)}>🗑️ Supprimer</button>
                        </div>
                    ))}
                    <button type="button" onClick={addSection}>➕ Ajouter une section</button>
                </div>

                <button type="submit" className="admin-form__button">
                    {adviceId === "new" ? "Ajouter" : "Mettre à jour"}
                </button>
            </form>
        </div>
    );
}
