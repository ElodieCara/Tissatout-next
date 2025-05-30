"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface SiteSettings {
    id?: string;
    homeBanners?: string[];
    universBanner: string;
    coloringBanner: string;
    adviceBanner: string;
    ideasBanner: string;
    agePageBanner: string;
    newsBanner: string;
}

const sections = [
    { key: "home", label: "🏠 Accueil" },
    { key: "univers", label: "🌟 Nos Univers" },
    { key: "coloring", label: "🎨 Coloriages" },
    { key: "advice", label: "📜 Conseils" },
    { key: "ideas", label: "💡 Idées" },
    { key: "agePage", label: "🧒 Pages d’âge" },
    { key: "news", label: "📰 Actualités" },
];

const getBannerImage = (key: string, settings: SiteSettings) => {
    if (key === "home") return settings.homeBanners?.[0] || "/images/placeholder.jpg";
    return (settings[`${key}Banner` as keyof SiteSettings] as string) || "/images/placeholder.jpg";
};


export default function AdminSiteSettings() {
    const [settings, setSettings] = useState<SiteSettings | null>(null);
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetch("/api/site-settings")
            .then((res) => res.json())
            .then((data) => setSettings(data))
            .catch(() => setMessage("❌ Erreur lors du chargement des paramètres."));
    }, []);

    if (!settings) return <p>Chargement…</p>;

    return (
        <div className="admin">
            <h2>🎛️ Paramètres des Bannières</h2>
            {message && <p>{message}</p>}
            <div className="admin__list">
                {sections.map(({ key, label }) => (
                    <Link
                        key={key}
                        href={`/admin/settings/${key}`}
                        className="admin__list-item clickable"
                    >
                        <img
                            src={getBannerImage(key, settings)}
                            alt={label}
                            className="admin__list-item-image"
                        />
                        <div className="admin__list-item-title">{label}</div>
                    </Link>
                ))}

            </div>
        </div>
    );
}
