"use client";

import { useEffect, useState } from "react";

interface HomeSlide {
    id?: string;
    imageUrl: string;
    title: string;
    description: string;
    buttonText?: string;
    buttonLink?: string;
    order: number;
}

export default function HomeSlidesEditor() {
    const [slides, setSlides] = useState<HomeSlide[]>([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetch("/api/home-slides")
            .then((res) => res.json())
            .then((data) => setSlides(data))
            .catch(() => setMessage("Erreur lors du chargement des slides."));
    }, []);

    const handleImageUpload = async (file: File, index: number) => {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
            method: "POST",
            body: formData,
        });

        if (res.ok) {
            const data = await res.json();
            const updatedSlides = [...slides];
            updatedSlides[index].imageUrl = data.imageUrl;
            setSlides(updatedSlides);
        } else {
            setMessage("Erreur lors de l'upload de l'image.");
        }
    };

    const updateSlide = <K extends keyof HomeSlide>(
        index: number,
        field: K,
        value: HomeSlide[K]
    ) => {
        const updated = [...slides];
        updated[index][field] = value;
        setSlides(updated);
    };

    const addSlide = () => {
        setSlides([
            ...slides,
            {
                imageUrl: "",
                title: "",
                description: "",
                buttonText: "",
                buttonLink: "",
                order: slides.length, // 👈 important !
            },
        ]);
    };

    const removeSlide = async (index: number) => {
        const slide = slides[index];

        // Si le slide est déjà en base, on le supprime côté serveur
        if (slide.id) {
            const res = await fetch("/api/home-slides", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: slide.id }),
            });

            if (!res.ok) {
                setMessage("❌ Erreur lors de la suppression du slide.");
                return;
            }
        }

        // Et on l’enlève localement
        setSlides(slides.filter((_, i) => i !== index));
    };

    const saveSlides = async () => {
        try {
            const results = await Promise.all(
                slides.map((slide, index) => {
                    const method = slide.id ? "PUT" : "POST";
                    const url = "/api/home-slides";
                    const body = JSON.stringify({ ...slide, order: index });

                    return fetch(url, {
                        method,
                        headers: { "Content-Type": "application/json" },
                        body,
                    });
                })
            );

            const allOk = results.every((res) => res.ok);
            setMessage(allOk ? "✅ Slides enregistrés !" : "❌ Erreur lors de l'enregistrement.");

            // 🔁 Recharge propre depuis la base
            if (allOk) {
                const fresh: HomeSlide[] = await fetch("/api/home-slides").then(res => res.json());
                const cleaned = fresh
                    .filter((s: HomeSlide) => s && s.imageUrl && typeof s.imageUrl === "string")
                    .sort((a: HomeSlide, b: HomeSlide) => a.order - b.order)
                setSlides(cleaned);
            }

        } catch (err) {
            setMessage("❌ Erreur inattendue lors de l'enregistrement.");
        }
    };


    return (
        <div className="admin-form__slide">
            <h3>🏠 Accueil — Slideshow & Contenu</h3>
            {message && <p className="admin-form__message">{message}</p>}

            {slides.map((slide, index) => (
                <div key={index} className="admin-form__slide__banner-item">
                    <div className="admin-form__slide__content">
                        <label>Image du slide {index + 1}</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleImageUpload(file, index);
                            }}
                        />

                        {slide.imageUrl && (
                            <img
                                src={slide.imageUrl}
                                className="admin-form__slide__preview"
                                alt="aperçu"
                            />
                        )}

                        <button
                            type="button"
                            onClick={() => removeSlide(index)}
                            className="btn-remove"
                        >
                            ❌
                        </button>

                        <label>Titre</label>
                        <input
                            type="text"
                            value={slide.title}
                            onChange={(e) => updateSlide(index, "title", e.target.value)}
                        />

                        <label>Description</label>
                        <textarea
                            value={slide.description}
                            onChange={(e) => updateSlide(index, "description", e.target.value)}
                        />

                        <label>Texte du bouton (optionnel)</label>
                        <input
                            type="text"
                            value={slide.buttonText || ""}
                            onChange={(e) => updateSlide(index, "buttonText", e.target.value)}
                        />

                        <label>Lien du bouton (optionnel)</label>
                        <input
                            type="text"
                            value={slide.buttonLink || ""}
                            onChange={(e) => updateSlide(index, "buttonLink", e.target.value)}
                        />
                    </div>
                    <hr />
                </div>
            ))}


            <button type="button" onClick={addSlide} className="admin-form__button">
                ➕ Ajouter un slide
            </button>

            <button type="button" onClick={saveSlides} className="admin-form__button">
                Enregistrer
            </button>
        </div>
    );
}
