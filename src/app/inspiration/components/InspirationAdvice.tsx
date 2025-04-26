"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface Advice {
    id: string;
    title: string;
    slug: string;
    description: string;
    category: string;
    imageUrl?: string;
}

const medievalCategories = [
    { key: "savoirs", icon: "📚", title: "Savoirs & Lettres", description: "Lecture, écriture, mémorisation et récitation." },
    { key: "harmonie", icon: "🎶", title: "Harmonie & Discipline", description: "L’importance de la musique, du rythme et de la concentration." },
    { key: "eloquence", icon: "🏰", title: "Rhétorique & Expression", description: "Maîtriser l’art du discours et du récit." }
];

// ✅ Image par défaut 
const defaultImage = "/default.jpg";

export default function InspirationAdvice({ advices }: { advices: Advice[] }) {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

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
                                    <Link
                                        key={advice.id}
                                        href={`/conseils/${advice.slug}`}
                                        className="medieval__advice__item"
                                    >
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
                                    </Link>
                                );
                            })}
                    </div>
                </div>
            )}
        </section>
    );
}
