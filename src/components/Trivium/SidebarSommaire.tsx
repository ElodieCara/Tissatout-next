"use client";

import Link from "next/link";

interface Collection {
    id: string;
    title: string;
    slug: string;
    lessonsCount: number;
}

interface TriviumSidebarProps {
    collections: Collection[];
    selectedId?: string;
    onSelect?: (id?: string) => void;
    module: "trivium" | "quadrivium";
}

export default function TriviumSidebar({
    collections,
    selectedId,
    onSelect,
    module,
}: TriviumSidebarProps) {
    const categoryLabels = {
        trivium: ["Grammaire", "Logique", "Rhétorique"],
        quadrivium: ["Arithmétique", "Géométrie", "Musique", "Astronomie"],
    };

    return (
        <aside className="trivium-sidebar">
            <h3 className="trivium-sidebar__title">
                {module === "trivium" ? "🧠 Trivium" : "🔭 Quadrivium"}
            </h3>

            <ul className="trivium-sidebar__list">
                <li
                    className={`trivium-sidebar__item${!selectedId ? " trivium-sidebar__item--active" : ""
                        }`}
                >
                    <button
                        onClick={() => onSelect?.(undefined)}
                        className="trivium-sidebar__link"
                    >
                        Toutes les collections
                    </button>
                </li>

                {collections.map((collection) => (
                    <li
                        key={collection.id}
                        className={`trivium-sidebar__item${selectedId === collection.id
                                ? " trivium-sidebar__item--active"
                                : ""
                            }`}
                    >
                        <Link
                            href={`#${collection.slug}`}
                            onClick={() => onSelect?.(collection.id)}
                            className="trivium-sidebar__link"
                        >
                            <span>{collection.title}</span>
                            <span className="trivium-sidebar__count">
                                ({collection.lessonsCount})
                            </span>
                        </Link>
                    </li>
                ))}
            </ul>
        </aside>
    );
}
