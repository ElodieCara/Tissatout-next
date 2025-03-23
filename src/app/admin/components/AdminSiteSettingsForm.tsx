"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface SiteSettings {
    id?: string;

    homeBanner: string;
    homeTitle: string;
    homeDesc: string;

    universBanner: string;
    universTitle: string;
    universDesc: string;

    coloringBanner: string;
    coloringTitle: string;
    coloringDesc: string;

    adviceBanner: string;
    adviceTitle: string;
    adviceDesc: string;

    ideasBanner: string;
    ideasTitle: string;
    ideasDesc: string;

    agePageBanner: string;
    agePageTitle: string;
    agePageDesc: string;

    newsBanner: string;
    newsTitle: string;
    newsDesc: string;
}
interface AdminSiteSettingsFormProps {
    settingsData: SiteSettings;
}

const sections = [
    { key: "home", label: "🏠 Accueil" },
    { key: "univers", label: "🌟 Nos Univers" },
    { key: "coloring", label: "🎨 Coloriages" },
    { key: "advice", label: "📜 Conseils" },
    { key: "ideas", label: "💡 Inspirations & Conseils" },
    { key: "agePage", label: "🧒 Pages d'âge" },
    { key: "news", label: "📰 Actualités" },
];

export default function AdminSiteSettingsForm({ settingsData }: AdminSiteSettingsFormProps) {
    const [form, setForm] = useState<SiteSettings>(settingsData);
    const [message, setMessage] = useState("");

    const handleImageUpload = async (file: File, key: string) => {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
            method: "POST",
            body: formData,
        });

        if (res.ok) {
            const data = await res.json();
            setForm((prev) => ({ ...prev, [`${key}Banner`]: data.imageUrl }));
        } else {
            setMessage("❌ Erreur lors de l'upload de l'image.");
        }
    };

    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // 🧼 Sanitize les null/undefined AVANT d’envoyer
        const sanitizedForm = Object.fromEntries(
            Object.entries(form).map(([key, value]) => [key, value ?? ""])
        );

        try {
            const res = await fetch("/api/site-settings", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(sanitizedForm),
            });

            if (res.ok) {
                setMessage("✅ Paramètres enregistrés !");
                setTimeout(() => {
                    router.push("/admin?section=settings");
                }, 1000);
            } else {
                setMessage("❌ Une erreur est survenue.");
            }
        } catch (error) {
            setMessage("❌ Le serveur ne répond pas.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="admin-form">
            {message && <p className="admin-form__message">{message}</p>}

            {sections.map(({ key, label }) => (
                <div key={key} className="admin-form__section">
                    <h3>{label}</h3>

                    {/* Image */}
                    <label>Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageUpload(file, key);
                        }}
                    />
                    {form[`${key}Banner` as keyof SiteSettings] && (
                        <img
                            src={form[`${key}Banner` as keyof SiteSettings] as string}
                            alt={`Bannière ${label}`}
                            className="admin-form__preview"
                        />
                    )}

                    {/* Titre */}
                    <label>Titre</label>
                    <input
                        type="text"
                        value={form[`${key}Title` as keyof SiteSettings] as string || ""}
                        onChange={(e) =>
                            setForm((prev) => ({
                                ...prev,
                                [`${key}Title`]: e.target.value,
                            }))
                        }
                    />

                    {/* Description */}
                    <label>Description</label>
                    <textarea
                        value={form[`${key}Desc` as keyof SiteSettings] as string || ""}
                        onChange={(e) =>
                            setForm((prev) => ({
                                ...prev,
                                [`${key}Desc`]: e.target.value,
                            }))
                        }
                    />
                </div>
            ))}

            <button type="submit" className="admin-form__button">Enregistrer</button>
        </form>
    );
}
