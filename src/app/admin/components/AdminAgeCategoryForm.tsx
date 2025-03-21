"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface AgeCategory {
    id?: string;
    title: string;
    slug: string;
    description: string;
    imageCard: string;
    imageBanner: string;
}

export default function AdminAgeCategoryForm({
    ageCategoryId,
}: {
    ageCategoryId?: string;
}) {
    const [form, setForm] = useState<AgeCategory>({
        title: "",
        slug: "",
        description: "",
        imageCard: "",
        imageBanner: "",
    });

    const [message, setMessage] = useState("");
    const router = useRouter();

    // 🔄 Chargement des données si modification
    useEffect(() => {
        if (ageCategoryId && ageCategoryId !== "new") {
            fetch(`/api/ageCategory/${ageCategoryId}`)
                .then((res) => res.json())
                .then((data) => setForm(data))
                .catch(() =>
                    setMessage("❌ Erreur lors du chargement de la catégorie.")
                );
        }
    }, [ageCategoryId]);

    // 🟡 Gestion des inputs
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    // 📸 Fonction pour uploader une image
    const handleImageUpload = async (
        e: React.ChangeEvent<HTMLInputElement>,
        field: "imageCard" | "imageBanner"
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            if (res.ok) {
                setForm((prev) => ({ ...prev, [field]: data.imageUrl }));
                setMessage("✅ Image uploadée !");
            } else {
                setMessage("❌ Erreur lors de l'upload.");
            }
        } catch {
            setMessage("❌ Erreur de connexion avec le serveur.");
        }
    };


    // ✅ Soumission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const method =
            ageCategoryId && ageCategoryId !== "new" ? "PUT" : "POST";
        const url =
            ageCategoryId && ageCategoryId !== "new"
                ? `/api/ageCategory/${ageCategoryId}`
                : `/api/ageCategory`;

        const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });

        if (res.ok) {
            setMessage("✅ Catégorie enregistrée !");
            setTimeout(() => router.push("/admin?section=ageCategories"), 1000);
        } else {
            setMessage("❌ Erreur lors de l'enregistrement.");
        }
    };

    return (
        <div className="admin-form">
            <h2>
                {ageCategoryId === "new"
                    ? "➕ Ajouter une catégorie d’âge"
                    : "✏️ Modifier une catégorie d’âge"}
            </h2>

            {message && <p className="admin-form__message">{message}</p>}

            <form onSubmit={handleSubmit}>
                <div className="admin-form__group">
                    <label htmlFor="title">Titre</label>
                    <input
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        className="admin-form__group-input"
                        required
                    />
                </div>

                <div className="admin-form__group">
                    <label htmlFor="slug">Slug</label>
                    <input
                        type="text"
                        name="slug"
                        value={form.slug}
                        onChange={handleChange}
                        className="admin-form__group-input"
                        required
                    />
                </div>

                <div className="admin-form__group">
                    <label htmlFor="description">Description</label>
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        className="admin-form__group-input"
                        required
                    />
                </div>

                <div className="admin-form__group">
                    <label htmlFor="imageCard">🖼️ Image de carte</label>
                    <input
                        type="file"
                        id="imageCard"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, "imageCard")}
                    />
                    {form.imageCard && <img src={form.imageCard} alt="Image Card" className="admin-form__upload-preview" />}
                </div>

                {/* <div className="admin-form__group">
                    <label htmlFor="imageBanner">Image (Bannière)</label>
                    <input
                        type="text"
                        name="imageBanner"
                        value={form.imageBanner}
                        onChange={handleChange}
                        className="admin-form__group-input"
                    />
                </div> */}

                <button type="submit" className="admin-form__button">
                    {ageCategoryId === "new" ? "Ajouter" : "Mettre à jour"}
                </button>
            </form>
        </div>
    );
}
