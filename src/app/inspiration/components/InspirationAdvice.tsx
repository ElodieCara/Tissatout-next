"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

interface Advice {
    id: string;
    title: string;
    description: string;
    category: string;
    imageUrl?: string;
}

const medievalCategories = [
    { key: "savoirs", icon: "📚", title: "Savoirs & Lettres", description: "Lecture, écriture, mémorisation et récitation." },
    { key: "harmonie", icon: "🎶", title: "Harmonie & Discipline", description: "L’importance de la musique, du rythme et de la concentration." },
    { key: "eloquence", icon: "🏰", title: "Rhétorique & Expression", description: "Maîtriser l’art du discours et du récit." }
];

// ✅ Image par défaut (à mettre dans `public/`)
const defaultImage = "/default.jpg";

export default function InspirationAdvice() {
    const [advices, setAdvices] = useState<Advice[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const res = await fetch("/api/advice");
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

                const data = await res.json();
                if (!Array.isArray(data)) throw new Error("Invalid data format");

                console.log("✅ Conseils chargés :", data); // 🔍 Vérifie les données reçues
                setAdvices(data);
            } catch (error) {
                console.error("Fetch error:", error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    if (loading) return <div>Chargement...</div>;

    return (
        <section className="container__advice">
            <h2>📜 Conseils d’Éducation Médiévale</h2>

            <div className="medieval__categories">
                {medievalCategories.map(({ key, icon, title, description }) => (
                    <div
                        key={key}
                        className={`medieval__card ${selectedCategory === key ? "active" : ""}`}
                        onClick={() => setSelectedCategory(selectedCategory === key ? null : key)}
                    >
                        <div className="medieval__card__icon">{icon}</div>
                        <h3>{title}</h3>
                        <p>{description}</p>
                    </div>
                ))}
            </div>

            {selectedCategory && (
                <div className="medieval__advice">
                    <h3>📖 {medievalCategories.find(c => c.key === selectedCategory)?.title}</h3>

                    <div className="medieval__advice__list">
                        {advices
                            .filter(a => a.category.toLowerCase().trim() === selectedCategory?.toLowerCase().trim())
                            .map((advice) => {
                                // 🔥 Vérifie si l'image est bien définie
                                console.log("🖼️ Conseil :", advice);

                                const imageUrl = advice.imageUrl && advice.imageUrl.trim() !== "" ? advice.imageUrl : defaultImage;

                                return (
                                    <div key={advice.id} className="medieval__advice__item">
                                        <div className="medieval__advice__item-image" style={{ position: "relative", width: "20%", height: "100%" }}>
                                            {imageUrl ? (
                                                <Image
                                                    src={imageUrl}
                                                    alt={advice.title}
                                                    fill
                                                    style={{ objectFit: "cover" }}
                                                    sizes="(max-width: 768px) 100vw, 50vw"
                                                />
                                            ) : (
                                                <div className="image-fallback">
                                                    <span>📜 Image non disponible</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="medieval__advice__item-content">
                                            <h4>{advice.title}</h4>
                                            <p>{advice.description?.substring(0, 120) || "Description non disponible"}...</p>
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                </div>
            )}
        </section>
    );
}
