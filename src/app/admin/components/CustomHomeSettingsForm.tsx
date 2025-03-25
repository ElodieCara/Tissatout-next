"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface SiteSettings {
    id?: string;
    homeBanners?: string[];
    homeTitle?: string;
    homeDesc?: string;
}

export default function CustomHomeSettingsForm() {
    const [form, setForm] = useState<SiteSettings>({
        homeBanners: [],
        homeTitle: "",
        homeDesc: "",
    });
    const [message, setMessage] = useState("");
    const router = useRouter();

    useEffect(() => {
        fetch("/api/site-settings")
            .then((res) => res.json())
            .then((data) => {
                setForm({
                    id: data.id,
                    homeBanners: data.homeBanners || [],
                    homeTitle: data.homeTitle || "",
                    homeDesc: data.homeDesc || "",
                });
            })
            .catch(() => setMessage("❌ Erreur lors du chargement."));
    }, []);

    const handleImageUpload = async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
            method: "POST",
            body: formData,
        });

        if (res.ok) {
            const data = await res.json();
            setForm((prev) => ({
                ...prev,
                homeBanners: [...(prev.homeBanners || []), data.imageUrl],
            }));
        } else {
            setMessage("❌ Erreur lors de l'upload.");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            id: form.id,
            homeBanners: form.homeBanners || [],
            homeTitle: form.homeTitle ?? "",
            homeDesc: form.homeDesc ?? "",
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

    return (
        <div className="admin">
            <h2>🏠 Accueil — Slideshow & Contenu</h2>
            {message && <p>{message}</p>}
            <form onSubmit={handleSubmit} className="admin-form">
                {/* Slideshow */}
                <label>Images du slideshow</label>
                <div className="admin-form__banners-list">
                    {(form.homeBanners || []).map((url, idx) => (
                        <div key={idx} className="admin-form__banner-item">
                            <img src={url} alt={`Slide ${idx + 1}`} className="admin-form__preview" />
                            <button
                                type="button"
                                className="btn-remove"
                                onClick={() =>
                                    setForm((prev) => ({
                                        ...prev,
                                        homeBanners: prev.homeBanners?.filter((_, i) => i !== idx),
                                    }))
                                }
                            >
                                Supprimer
                            </button>
                        </div>
                    ))}
                </div>


                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file);
                    }}
                />

                {/* Titre */}
                <label>Titre de la page</label>
                <input
                    type="text"
                    value={form.homeTitle || ""}
                    onChange={(e) => setForm((prev) => ({ ...prev, homeTitle: e.target.value }))}
                />

                {/* Description */}
                <label>Description</label>
                <textarea
                    value={form.homeDesc || ""}
                    onChange={(e) => setForm((prev) => ({ ...prev, homeDesc: e.target.value }))}
                />

                <button type="submit" className="admin-form__button">
                    Enregistrer
                </button>
            </form>
        </div>
    );
}
