"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Breadcrumb from "./Breadcrumb";


interface Article {
    id?: string;
    title: string;
    content: string;
    image?: string;
    description?: string;
    date?: string;
}

export default function AdminArticleForm({ articleId }: { articleId?: string }) {
    const [form, setForm] = useState<Article>({ title: "", content: "", image: "", description: "", date: "" });
    const [message, setMessage] = useState("");
    const router = useRouter();

    // 🟢 Charger l'article en modification
    useEffect(() => {
        if (articleId && articleId !== "new") {
            fetch(`/api/articles/${articleId}`)
                .then((res) => res.json())
                .then((data) => setForm(data));
        }
    }, [articleId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // 🟡 Gérer l'upload d'image
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
            method: "POST",
            body: formData,
        });

        const data = await res.json();
        if (res.ok) {
            setForm({ ...form, image: data.imageUrl });
            setMessage("Image uploadée !");
        } else {
            setMessage("Erreur lors de l'upload.");
        }
    };

    // 🟡 Gérer l'ajout ou la modification
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const method = articleId && articleId !== "new" ? "PUT" : "POST";
        const url = articleId && articleId !== "new" ? `/api/articles/${articleId}` : "/api/articles";

        const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });

        if (res.ok) {
            setMessage("Article enregistré !");
            setTimeout(() => router.push("/admin"), 1000);
        } else {
            setMessage("Erreur !");
        }
    };

    return (
        <div className="admin-form">
            <Breadcrumb />
            <h2>{articleId === "new" ? "Ajouter un Article" : "Modifier l'Article"}</h2>
            {message && <p className="admin-form__message">{message}</p>}
            <form onSubmit={handleSubmit}>
                <div className="admin-form__group">
                    <label htmlFor="title">Titre</label>
                    <input type="text" id="title" name="title" placeholder="Titre" value={form.title} onChange={handleChange} required />
                </div>

                <div className="admin-form__group">
                    <label htmlFor="content">Contenu</label>
                    <textarea id="content" name="content" placeholder="Contenu" value={form.content} onChange={handleChange} required />
                </div>

                {/* 📌 Bloc d'Upload d'Image */}
                <div className="admin-form__upload">
                    <label htmlFor="imageUpload">📸 Glissez une image ici ou cliquez</label>
                    <input type="file" id="imageUpload" accept="image/*" onChange={handleImageUpload} />
                    {form.image && <img src={form.image} alt="Aperçu" />}
                </div>

                <div className="admin-form__group">
                    <label htmlFor="description">Description</label>
                    <input type="text" id="description" name="description" placeholder="Description" value={form.description} onChange={handleChange} />
                </div>

                <div className="admin-form__group">
                    <label htmlFor="date">Date</label>
                    <input type="date" id="date" name="date" value={form.date} onChange={handleChange} />
                </div>

                <button type="submit" className="admin-form__button">{articleId === "new" ? "Ajouter" : "Mettre à jour"}</button>
            </form>
        </div>
    );
}
