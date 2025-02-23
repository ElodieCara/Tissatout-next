"use client";
import { useState, useEffect } from "react";

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

export default function InspirationAdvice() {
    const [advices, setAdvices] = useState<Advice[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [visibleAdvices, setVisibleAdvices] = useState(5);

    useEffect(() => {
        fetch("/api/advice")
            .then((res) => res.json())
            .then((data) => setAdvices(data))
            .catch((err) => console.error("❌ Erreur lors du chargement des conseils :", err));
    }, []);

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
                    <h3>
                        📖 {medievalCategories.find((cat) => cat.key === selectedCategory)?.title}
                    </h3>

                    <div className="medieval__advice__list">
                        {advices
                            .filter((advice) => advice.category === selectedCategory)
                            .slice(0, visibleAdvices)
                            .map((advice) => (
                                <div key={advice.id} className="medieval__advice__item">
                                    <h4>{advice.title}</h4>
                                    <p>{advice.description.substring(0, 120)}...</p>
                                </div>
                            ))}
                    </div>
                </div>
            )}
        </section>
    );
}
