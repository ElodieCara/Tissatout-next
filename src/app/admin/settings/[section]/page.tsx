// app/admin/settings/[section]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface SiteSettings {
    id?: string;
    [key: string]: string | undefined;
}

const sectionLabels: Record<string, string> = {
    home: "🏠 Accueil",
    univers: "🌟 Nos Univers",
    coloring: "🎨 Coloriages",
    advice: "📜 Conseils",
    ideas: "💡 Idées",
    agePage: "🧒 Pages d’âge",
    news: "📰 Actualités",
};

export default function AdminSettingsSectionPage() {
    const { section } = useParams() as { section: string };
    const router = useRouter();

    const [form, setForm] = useState<SiteSettings>({});
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetch("/api/site-settings")
            .then((res) => res.json())
            .then((data) => {
                setForm({
                    [`${section}Banner`]: data[`${section}Banner`] || "",
                    [`${section}Title`]: data[`${section}Title`] || "",
                    [`${section}Desc`]: data[`${section}Desc`] || "",
                    id: data.id,
                });
            })
            .catch(() => setMessage("❌ Erreur lors du chargement."));
    }, [section]);

    const handleImageUpload = async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
            method: "POST",
            body: formData,
        });

        if (res.ok) {
            const data = await res.json();
            setForm((prev) => ({ ...prev, [`${section}Banner`]: data.imageUrl }));
        } else {
            setMessage("❌ Erreur lors de l'upload.");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            id: form.id,
            [`${section}Banner`]: form[`${section}Banner`],
            [`${section}Title`]: form[`${section}Title`],
            [`${section}Desc`]: form[`${section}Desc`],
        };

        const res = await fetch("/api/site-settings", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (res.ok) {
            setMessage("✅ Modifications enregistrées !");
            setTimeout(() => router.push("/admin"), 1000);
        } else {
            setMessage("❌ Une erreur est survenue.");
        }
    };

    if (!sectionLabels[section]) {
        return <p>❌ Section inconnue.</p>;
    }

    return (
        <div className="admin">
            <h2>Modifier {sectionLabels[section]}</h2>
            {message && <p>{message}</p>}
            <form onSubmit={handleSubmit} className="admin-form">
                {/* Image */}
                <label>Image</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file);
                    }}
                />
                {form[`${section}Banner`] && (
                    <img
                        src={form[`${section}Banner`] as string}
                        alt="Aperçu"
                        className="admin-form__preview"
                    />
                )}

                {/* Titre */}
                <label>Titre</label>
                <input
                    type="text"
                    value={form[`${section}Title`] || ""}
                    onChange={(e) =>
                        setForm((prev) => ({ ...prev, [`${section}Title`]: e.target.value }))
                    }
                />

                {/* Description */}
                <label>Description</label>
                <textarea
                    value={form[`${section}Desc`] || ""}
                    onChange={(e) =>
                        setForm((prev) => ({ ...prev, [`${section}Desc`]: e.target.value }))
                    }
                />

                <button type="submit" className="admin-form__button">Enregistrer</button>
            </form>
        </div>
    );
}
