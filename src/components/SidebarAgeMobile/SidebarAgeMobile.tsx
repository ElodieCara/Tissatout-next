"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type SidebarMobileProps = {
    isOpen: boolean;
    onClose: () => void;
};

interface AgeCategory {
    id: string;
    title: string;
    description: string;
    slug: string;
    tags: { label: string; color: string }[];
}

export default function SidebarAgeMobile({ isOpen, onClose }: SidebarMobileProps) {
    const [categories, setCategories] = useState<AgeCategory[]>([]);
    const router = useRouter();

    useEffect(() => {
        fetch("/api/ageCategory")
            .then((res) => res.json())
            .then((data) => setCategories(data))
            .catch((err) => console.error("Erreur chargement catégories:", err));
    }, []);

    if (!isOpen) return null;

    return (
        <div className="age-sidebar__overlay" onClick={onClose}>
            <div className="age-sidebar__panel" onClick={(e) => e.stopPropagation()}>
                <div className="age-sidebar__header">
                    <h2>Explorer par âge</h2>
                    <button className="age-sidebar__close" onClick={onClose}>✖</button>
                </div>

                <div className="age-sidebar__column">
                    {categories.map((cat, index) => {
                        const age = cat.title.match(/\d+/)?.[0] ?? "?";
                        return (
                            <button
                                key={cat.id}
                                className={`age-sidebar__age-button age-sidebar__age-button--${index}`}
                                onClick={() => router.push(`/nos-univers/${cat.slug}`)}
                            >
                                <span className="age-sidebar__age">{age}</span>
                                <span className="age-sidebar__label">{cat.title}</span>
                            </button>
                        );
                    })}
                </div>

            </div>
        </div>
    );
}
