import { useState } from "react";

const categoryIcons: Record<string, string> = {
    "lecture": "/icons/lecture.png",
    "chiffre": "/icons/chiffre.png",
    "logique": "/icons/logique.png",
    "mobilité": "/icons/mobilite.png"
};

export default function AdminForm({ onArticleAdded }: { onArticleAdded: () => void }) {
    const [form, setForm] = useState({
        title: "",
        content: "",
        image: "",
        iconSrc: "", // ✅ Ajout de l'icône
        category: "", // ✅ Ajout de la catégorie
        description: "",
        date: ""
    }); const [message, setMessage] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        // ✅ Si l'utilisateur change la catégorie, on met à jour `iconSrc`
        if (name === "category") {
            setForm({
                ...form,
                category: value,
                iconSrc: categoryIcons[value] || "" // ✅ Mise à jour de l'icône
            });
        } else {
            setForm({ ...form, [name]: value });
        }
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
            setForm({ title: "", content: "", image: "", iconSrc: "", category: "", description: "", date: "" }); onArticleAdded();
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

                {/* ✅ Sélection de la catégorie */}
                <select name="category" value={form.category} onChange={handleChange} required className="admin__form-input">
                    <option value="">-- Sélectionnez une catégorie --</option>
                    <option value="lecture">Lecture</option>
                    <option value="chiffre">Chiffres</option>
                    <option value="logique">Jeux de logique</option>
                    <option value="mobilité">Jeux de mobilité</option>
                </select>

                {/* ✅ Aperçu de l'icône sélectionnée */}
                {form.iconSrc && <img src={form.iconSrc} alt="Icône sélectionnée" width="50" height="50" className="admin__form-icon" />}

                <input type="text" name="description" placeholder="Description" value={form.description} onChange={handleChange} className="admin__form-input" />
                <input type="date" name="date" value={form.date} onChange={handleChange} className="admin__form-input" />
                <button type="submit" className="admin__form-button">Ajouter</button>
            </form>
        </div>
    );
}
