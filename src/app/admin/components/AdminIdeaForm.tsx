"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Breadcrumb from "./Breadcrumb";

interface AdminIdeaFormProps {
    ideaId?: string; // Optionnel : utilisé pour modifier une idée
}

export default function AdminIdeaForm({ ideaId }: AdminIdeaFormProps) {
    const [form, setForm] = useState({ title: "", description: "", image: "", theme: "" });
    const [message, setMessage] = useState("");
    const router = useRouter();

    // Charger les données de l'idée si un `ideaId` est passé
    useEffect(() => {
        if (ideaId) {
            fetch(`/api/ideas/${ideaId}`)
                .then((res) => res.json())
                .then((data) => setForm(data))
                .catch((err) => console.error("Erreur lors du chargement de l'idée :", err));
        }
    }, [ideaId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();

        if (res.ok) {
            setForm({ ...form, image: data.imageUrl });
            setMessage("Image uploadée !");
        } else {
            setMessage("Erreur lors de l'upload.");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const method = ideaId ? "PUT" : "POST";
        const url = ideaId ? `/api/ideas/${ideaId}` : "/api/ideas";

        const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });

        if (res.ok) {
            setMessage(`Idée ${ideaId ? "mise à jour" : "ajoutée"} avec succès !`);
            setTimeout(() => router.push("/admin?section=ideas"), 1000);
        } else {
            setMessage("Erreur lors de l'enregistrement de l'idée.");
        }
    };

    return (
        <div className="admin-form">
            <Breadcrumb />
            <h2>{ideaId ? "Modifier l'Idée" : "Ajouter une Nouvelle Idée"} 💡</h2>
            {message && <p className="admin-form__message">{message}</p>}
            <form onSubmit={handleSubmit}>
                <div className="admin-form__group">
                    <label htmlFor="title">Titre</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        placeholder="Titre de l'idée"
                        value={form.title}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="admin-form__group">
                    <label htmlFor="description">Description (max. 150 caractères)</label>
                    <textarea
                        id="description"
                        name="description"
                        placeholder="Entrez une brève description..."
                        value={form.description}
                        onChange={(e) => {
                            if (e.target.value.length > 150) {
                                alert("❌ La description ne peut pas dépasser 150 caractères !");
                            } else {
                                setForm({ ...form, description: e.target.value });
                            }
                        }}
                        maxLength={150}
                    />
                    <p>{form.description.length} / 150 caractères</p>
                </div>
                {/* 📌 Upload d'image */}
                <div className="admin-form__upload">
                    <label htmlFor="imageUpload">📸 Glissez une image ici ou cliquez</label>
                    <input type="file" id="imageUpload" accept="image/*" onChange={handleImageUpload} />
                    {form.image && <img src={form.image} alt="Aperçu" />}
                </div>
                <div className="admin-form__group">
                    <label htmlFor="theme">Thème</label>
                    <input
                        type="text"
                        id="theme"
                        name="theme"
                        placeholder="Thème de l'idée"
                        value={form.theme}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="admin-form__button">
                    {ideaId ? "Mettre à jour" : "Ajouter"}
                </button>
            </form>
        </div>
    );
}