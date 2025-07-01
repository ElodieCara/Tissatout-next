"use client";

import { useState, useRef, useEffect } from "react";
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
    {
        key: "savoirs",
        icon: "/assets/medieval/book.png",
        title: "Savoirs & Lettres",
        description: "Lecture, écriture, mémorisation et récitation.",
    },
    {
        key: "harmonie",
        icon: "/assets/medieval/note.png",
        title: "Harmonie & Discipline",
        description: "L’importance de la musique, du rythme et de la concentration.",
    },
    {
        key: "eloquence",
        icon: "/assets/medieval/chateau.png",
        title: "Rhétorique & Expression",
        description: "Maîtriser l’art du discours et du récit.",
    },
];

// ✅ Image par défaut
const defaultImage = "/default.jpg";

export default function InspirationAdvice({ advices }: { advices: Advice[] }) {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [visibleCount, setVisibleCount] = useState<number>(5);
    const adviceRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (selectedCategory && adviceRef.current) {
            adviceRef.current.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
            setVisibleCount(5); // ✅ Remet à 5 à chaque sélection
        }
    }, [selectedCategory]);

    const filteredAdvices = advices.filter(
        (a) =>
            a.category.toLowerCase().trim() === selectedCategory?.toLowerCase().trim()
    );

    const handleLoadMore = () => {
        setVisibleCount((prev) => prev + 5);
    };

    return (
        <section className="container__advice">
            <h2>Conseils d’Éducation Médiévale</h2>

            <div className="medieval__categories">
                {medievalCategories.map(({ key, icon, title, description }) => (
                    <div
                        key={key}
                        className={`medieval__card medieval__card--${key} ${selectedCategory === key ? "active" : ""
                            }`}
                        onClick={() =>
                            setSelectedCategory(selectedCategory === key ? null : key)
                        }
                    >
                        <div className="medieval__card__badge">
                            <div className="medieval__card__icon">
                                {icon ? (
                                    <Image src={icon} alt={title} width={240} height={240} />
                                ) : (
                                    <span>?</span>
                                )}
                            </div>
                        </div>
                        <h3>{title}</h3>
                        <p>{description}</p>
                        <div className="medieval__card__cta">⏷</div>
                    </div>
                ))}
            </div>

            {selectedCategory && (
                <div className="medieval__advice" ref={adviceRef}>
                    <div className="medieval__advice__header">
                        {(() => {
                            const cat = medievalCategories.find(
                                (c) => c.key === selectedCategory
                            );
                            return cat ? (
                                <h3>
                                    <span className="medieval__advice__icon">
                                        <Image
                                            src={cat.icon}
                                            alt={cat.title}
                                            width={24}
                                            height={24}
                                        />
                                    </span>
                                    {cat.title}
                                </h3>
                            ) : null;
                        })()}
                    </div>

                    <div className="medieval__advice__list">
                        {filteredAdvices.slice(0, visibleCount).map((advice) => {
                            const imageUrl =
                                advice.imageUrl && advice.imageUrl.trim() !== ""
                                    ? advice.imageUrl
                                    : defaultImage;

                            return (
                                <Link
                                    key={advice.id}
                                    href={`/conseils/${advice.slug}`}
                                    className="medieval__advice__item"
                                >
                                    <div
                                        className="medieval__advice__item-image"
                                        style={{
                                            position: "relative",
                                            width: "20%",
                                            height: "100%",
                                        }}
                                    >
                                        <Image
                                            src={imageUrl}
                                            alt={advice.title}
                                            fill
                                            style={{ objectFit: "cover" }}
                                            sizes="(max-width: 768px) 100vw, 50vw"
                                        />
                                    </div>

                                    <div className="medieval__advice__item-content">
                                        <h4>{advice.title}</h4>
                                        <p>
                                            {advice.description?.substring(0, 120) ||
                                                "Description non disponible"}
                                            ...
                                        </p>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>

                    {visibleCount < filteredAdvices.length && (
                        <button
                            onClick={handleLoadMore}
                            className="medieval__loadMore-button"
                        >
                            Voir plus
                        </button>
                    )}
                </div>
            )}
        </section>
    );
}
