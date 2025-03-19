"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Breadcrumb from "./Breadcrumb";
import { generateSlug } from "@/lib/utils";

// 🎨 Icônes associées aux catégories
const categoryIcons: Record<string, string> = {
    "lecture": "/icons/lecture.png",
    "chiffre": "/icons/chiffre.png",
    "logique": "/icons/logique.png",
    "mobilité": "/icons/mobilite.png",
    "craft": "/icons/crafts.png"
};

interface Article {
    id?: string;
    slug?: string;
    title: string;
    content: string;
    image?: string;
    iconSrc?: string;
    category: string;
    tags?: string[];
    author: string;
    description?: string;
    date?: string;
}

export default function AdminArticleForm({ articleId }: { articleId?: string }) {
    const [form, setForm] = useState<Article>({
        title: "",
        content: "",
        image: "",
        iconSrc: "",
        category: "",
        tags: [],
        author: "",
        description: "",
        date: ""
    });

    const [message, setMessage] = useState("");
    const router = useRouter();

    // 🟢 Charger l'article en modification
    useEffect(() => {
        if (articleId && articleId !== "new") {
            fetch(`/api/articles/${articleId}`)
                .then((res) => res.json())
                .then((data) => {
                    console.log("📥 Article reçu :", data);
                    setForm({
                        title: data.title || "",
                        content: data.content || "",
                        image: data.image || "",
                        iconSrc: data.iconSrc || categoryIcons[data.category] || "",
                        category: data.category || "",
                        tags: data.tags || [],
                        author: data.author || "",
                        description: data.description || "",
                        date: data.date ? data.date.substring(0, 10) : "" // ✅ Formatage de la date
                    });
                });
        }
    }, [articleId]);

    // 🟡 Gérer les changements dans le formulaire
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        // ✅ Mettre à jour l'icône automatiquement si la catégorie change
        if (name === "category") {
            setForm({
                ...form,
                category: value,
                iconSrc: categoryIcons[value] || ""
            });
        }
        // ✅ Gestion des tags (convertir string en tableau)
        else if (name === "tags") {
            setForm({ ...form, tags: value.split(",").map(tag => tag.trim()) });
        }
        else {
            setForm({ ...form, [name]: value });
        }
    };

    // 🟡 Gérer l'upload d'image
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

    // 🟡 Gérer l'ajout ou la modification
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        console.log("Payload envoyé :", form);

        const method = articleId && articleId !== "new" ? "PUT" : "POST";
        const url = articleId && articleId !== "new" ? `/api/articles/${articleId}` : "/api/articles";

        let payload = { ...form };

        // 🔥 Si c'est un nouvel article, générer un slug
        if (articleId === "new") {
            payload.slug = generateSlug(form.title, crypto.randomUUID());
        }

        const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (res.ok) {
            setMessage("✅ Article enregistré !");
            setTimeout(() => router.push("/admin"), 1000);
        } else {
            setMessage("❌ Erreur lors de l'enregistrement.");
        }
    };

    return (
        <div className="admin-form">
            <Breadcrumb
                onThemeSelect={(theme) => console.log("Thème sélectionné:", theme)}
                onSubCategorySelect={(subCategory) => console.log("Sous-catégorie sélectionnée:", subCategory)}
            />

            <h2>{articleId === "new" ? "Ajouter un Article" : "Modifier l'Article"}</h2>
            {message && <p className="admin-form__message">{message}</p>}

            <form onSubmit={handleSubmit}>
                <div className="admin-form__group">
                    <label htmlFor="title">Titre</label>
                    <input type="text" id="title" name="title" placeholder="Titre" value={form.title} onChange={handleChange} required />
                </div>

                <div className="admin-form__group">
                    <label htmlFor="tags">Tags (séparés par des virgules)</label>
                    <input type="text" id="tags" name="tags" placeholder="Ex: 3-5 ans, 6-8 ans" value={form.tags?.join(", ") || ""} onChange={handleChange} />
                </div>

                <div className="admin-form__group">
                    <label htmlFor="content">Contenu</label>
                    <textarea id="content" name="content" placeholder="Contenu" value={form.content} onChange={handleChange} required />
                </div>

                {/* 📌 Sélection de la catégorie */}
                <div className="admin-form__group">
                    <label htmlFor="category">Catégorie</label>
                    <select id="category" name="category" value={form.category} onChange={handleChange} required>
                        <option value="">Choisir une catégorie</option>
                        <option value="lecture">📘 Lecture</option>
                        <option value="chiffre">🔢 Chiffre</option>
                        <option value="logique">🧩 Jeux de logique</option>
                        <option value="mobilité">🚀 Jeux de mobilité</option>
                        <option value="craft">✂️ Loisirs créatifs</option>
                    </select>
                </div>

                {/* ✅ Affichage de l'icône associée */}
                {form.iconSrc && (
                    <div className="admin-form__group">
                        <p>Icône associée :</p>
                        <img src={form.iconSrc} alt="Icône de catégorie" width="50" height="50" />
                    </div>
                )}

                {/* 📌 Upload d'image */}
                <div className="admin-form__upload">
                    <label htmlFor="imageUpload">📸 Glissez une image ici ou cliquez</label>
                    <input type="file" id="imageUpload" accept="image/*" onChange={handleImageUpload} />
                    {form.image && <img src={form.image} alt="Aperçu" />}
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
                                alert("❌ La description ne peut pas dépasser 250 caractères !");
                            } else {
                                setForm({ ...form, description: e.target.value });
                            }
                        }}
                        maxLength={250} // ✅ Empêche de taper plus de 250 caractères
                    />
                    <p>{form.description || "".length} / 150 caractères</p> {/* ✅ Affiche le compteur */}
                    <input type="text" id="description" name="description" placeholder="Description" value={form.description} onChange={handleChange} />
                </div>

                <div className="admin-form__group">
                    <label htmlFor="date">Date</label>
                    <input type="date" id="date" name="date" value={form.date} onChange={handleChange} />
                </div>

                <div className="admin-form__group">
                    <label htmlFor="author">Auteur</label>
                    <input
                        type="text"
                        id="author"
                        name="author"
                        placeholder="Nom de l'auteur"
                        value={form.author}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button type="submit" className="admin-form__button">{articleId === "new" ? "Ajouter" : "Mettre à jour"}</button>
            </form>
        </div>
    );
}
