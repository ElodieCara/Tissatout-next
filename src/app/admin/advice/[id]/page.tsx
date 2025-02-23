"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Breadcrumb from "../../components/Breadcrumb";

interface Advice {
    id?: string;
    title: string;
    description?: string;
    content: string;
    category: string;
}

export default function AdminAdviceForm({ adviceId }: { adviceId?: string }) {
    const isNew = adviceId === "new";
    const [form, setForm] = useState<Advice>({
        title: "",
        description: "",
        content: "",
        category: "savoirs"
    });
    const [message, setMessage] = useState("");
    const router = useRouter();

    // Charger un conseil si on modifie
    useEffect(() => {
        if (adviceId && adviceId !== "new") {
            fetch(`/api/advice/${adviceId}`)
                .then((res) => res.json())
                .then((data) => {
                    setForm({
                        title: data.title || "",
                        description: data.description || "",
                        content: data.content || "",
                        category: data.category || "savoirs",
                    });
                });
        }
    }, [adviceId]);

    // Gérer les changements dans le formulaire
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    // Rediriger vers la prévisualisation
    const handlePreview = () => {
        localStorage.setItem("advicePreview", JSON.stringify(form));
        router.push("/admin/advice/preview");
    };

    return (
        <div className="admin-form">
            <Breadcrumb />
            <h2>{isNew ? "Ajouter un Conseil" : "Modifier le Conseil"}</h2>
            {message && <p className="admin-form__message">{message}</p>}

            <form>
                <div className="admin-form__group">
                    <label htmlFor="title">Titre</label>
                    <input type="text" id="title" name="title" placeholder="Titre" value={form.title} onChange={handleChange} required />
                </div>

                <div className="admin-form__group">
                    <label htmlFor="description">Description courte (optionnelle)</label>
                    <textarea id="description" name="description" placeholder="Brève description" value={form.description} onChange={handleChange} />
                </div>

                <div className="admin-form__group">
                    <label htmlFor="content">Contenu détaillé</label>
                    <textarea id="content" name="content" placeholder="Contenu" value={form.content} onChange={handleChange} required />
                </div>

                <div className="admin-form__group">
                    <label htmlFor="category">Catégorie</label>
                    <select id="category" name="category" value={form.category} onChange={handleChange} required>
                        <option value="savoirs">📚 Savoirs & Lettres</option>
                        <option value="harmonie">🎶 Harmonie & Discipline</option>
                        <option value="eloquence">🏰 Rhétorique & Expression</option>
                    </select>
                </div>

                <button type="button" className="admin-form__button" onClick={handlePreview}>Prévisualiser</button>
            </form>
        </div>
    );
}
