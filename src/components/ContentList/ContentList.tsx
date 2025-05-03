// ContentList.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export interface ContentItem {
    id: string;
    title: string;
    slug: string;
    image?: string | null;
    description?: string | null;
}

interface ContentListProps {
    items: ContentItem[];
    type: string;
    title?: string;
}

export default function ContentList({ items, type, title }: ContentListProps) {
    const [visibleCount, setVisibleCount] = useState(6);
    const displayed = items.slice(0, visibleCount);

    const titleMap: Record<string, string> = {
        articles: "📚 Articles",
        conseils: "🧸 Conseils",
        idees: "💡 Idées créatives",
        trivium: "📘 Activités Trivium",
        quadrivium: "📗 Activités Quadrivium",
    };

    return (
        <section className="content-list">
            <div className="content-list__header">
                <h2 className="content-list__title">
                    {title || titleMap[type] || "Contenus"}
                </h2>
            </div>

            <div className="content-list__grid">
                {displayed.map((item) => (
                    <Link
                        href={`/${type}/${item.slug}`}
                        key={item.id}
                        className="content-list__card"
                    >
                        {item.image && (
                            <div className="content-list__image-wrapper">
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    width={300}
                                    height={200}
                                    className="content-list__image"
                                />
                            </div>
                        )}
                        <div className="content-list__info">
                            <h3 className="content-list__card-title">{item.title}</h3>
                            <p className="content-list__description">
                                {item.description ?? "Pas de description disponible."}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>

            {items.length > visibleCount && (
                <div className="content-list__footer">
                    <button
                        onClick={() => setVisibleCount((prev) => prev + 6)}
                        className="content-list__button"
                    >
                        ➕ Voir plus
                    </button>
                </div>
            )}
        </section>
    );
}
