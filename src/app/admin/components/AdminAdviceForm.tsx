"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Breadcrumb from "./Breadcrumb";

interface Advice {
    id?: string;
    title: string;
    content: string;
    category: string;
    description?: string;
    imageUrl?: string;
}

export default function AdminAdviceForm({ adviceId }: { adviceId?: string }) {
    const [form, setForm] = useState<Advice>({
        title: "",
        content: "",
        category: "",
        description: "",
        imageUrl: "",
    });

    const [message, setMessage] = useState("");
    const router = useRouter();

    // 🟢 Charger les données en modification
    useEffect(() => {
        if (adviceId && adviceId !== "new") {
            fetch(`/api/advice/${adviceId}`)
                .then((res) => res.json())
                .then((data) => {
                    console.log("📥 Conseil reçu :", data);
                    setForm(data);
                })
                .catch(() => setMessage("❌ Impossible de charger le conseil."));
        }
    }, [adviceId]);

    // 🟡 Gestion des changements dans le formulaire
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // 📸 Gérer l'upload d'image COMME AVANT
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();

        if (res.ok) {
            setForm((prev) => ({ ...prev, imageUrl: data.imageUrl })); // ✅ REVIENT À L'ANCIENNE MÉTHODE
            setMessage("✅ Image uploadée !");
        } else {
            setMessage("❌ Erreur lors de l'upload.");
        }
    };

    // 📤 Envoyer le formulaire (création/modification)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("📤 Payload envoyé :", form);

        const method = adviceId && adviceId !== "new" ? "PUT" : "POST";
        const url = adviceId && adviceId !== "new" ? `/api/advice/${adviceId}` : "/api/advice";

        const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });

        if (res.ok) {
            setMessage("✅ Conseil enregistré !");
            setTimeout(() => router.push("/admin?section=advice"), 1000);
        } else {
            setMessage("❌ Erreur lors de l'enregistrement.");
        }
    };

    return (
        <div className="admin-form">
            <Breadcrumb />
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
