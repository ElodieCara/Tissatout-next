import { useState } from "react";

export default function AdminForm({ onArticleAdded }: { onArticleAdded: () => void }) {
    const [form, setForm] = useState({ title: "", content: "", image: "", description: "", date: "" });
    const [message, setMessage] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Gestion de l'upload d'image
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch("/api/articles", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });

        if (res.ok) {
            setMessage("Article ajouté !");
            setForm({ title: "", content: "", image: "", description: "", date: "" });
            onArticleAdded();
        } else {
            setMessage("Erreur !");
        }
    };

    return (
        <div className="admin">
            <h1 className="admin__title">Ajouter un Article</h1>
            {message && <p className="admin__message">{message}</p>}

            <form onSubmit={handleSubmit} className="admin__form">
                <input type="text" name="title" placeholder="Titre" value={form.title} onChange={handleChange} required className="admin__form-input" />
                <textarea name="content" placeholder="Contenu" value={form.content} onChange={handleChange} required className="admin__form-input" />

                {/* Upload Image */}
                <input type="file" accept="image/*" onChange={handleImageUpload} className="admin__form-input" />
                {form.image && <img src={form.image} alt="Aperçu" width="200" className="admin__form-image" />}

                <input type="text" name="description" placeholder="Description" value={form.description} onChange={handleChange} className="admin__form-input" />
                <input type="date" name="date" value={form.date} onChange={handleChange} className="admin__form-input" />
                <button type="submit" className="admin__form-button">Ajouter</button>
            </form>
        </div>
    );
}
