"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import AgeOverviewPanel from "@/layout/Overview/AgeOverviewPanel";

type SidebarMobileProps = {
    isOpen: boolean;
    onClose: () => void;
};

interface AgeCategory {
    id: string;
    title: string;
    imageCard: string;
    description: string;
    slug: string;
    tags: { label: string; color: string }[];
}

export default function SidebarAgeMobile({ isOpen, onClose }: SidebarMobileProps) {
    const [categories, setCategories] = useState<AgeCategory[]>([]);
    const [activeCategory, setActiveCategory] = useState<AgeCategory | null>(null);
    const router = useRouter();

    useEffect(() => {
        fetch("/api/ageCategory")
            .then((res) => res.json())
            .then((data) => setCategories(data))
            .catch((err) => console.error("Erreur chargement catégories:", err));
    }, []);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768 && isOpen) {
                onClose(); // Ferme la sidebar automatiquement
            }
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="age-sidebar__overlay" onClick={onClose}>
            <div className="age-sidebar__panel" onClick={(e) => e.stopPropagation()}>
                <div className="age-sidebar__header">
                    <h2>Explorer par âge</h2>
                    <button className="age-sidebar__close" onClick={onClose}>✖</button>
                </div>
                <div className="age-sidebar__top">
                    {activeCategory ? (
                        <>
                            <h3 className="age-sidebar__selected-title">{activeCategory.title}</h3>
                            <p className="age-sidebar__description">{activeCategory.description}</p>
                        </>
                    ) : (
                        <>
                            <h3 className="age-sidebar__selected-title">Choisissez un âge</h3>
                            <p className="age-sidebar__description">
                                Sélectionnez une tranche d’âge pour découvrir des activités adaptées.
                            </p>
                            <div className="age-sidebar__image">
                                <Image src="/images/tissatoupiSidebar.png"
                                    alt="Icon Explorer par âge"
                                    width={240}
                                    height={240}
                                    quality={100}
                                    priority
                                    className="age-sidebar__tissatoupi"
                                >
                                </Image>
                            </div>
                        </>
                    )}
                </div>
                <div className="age-sidebar__content">
                    <div className="age-sidebar__column">
                        {categories.map((cat, index) => (
                            <button
                                key={cat.id}
                                className={`age-sidebar__button age-sidebar__button--${index}`}
                                onClick={() => setActiveCategory(cat)}
                            >
                                <span className="age-sidebar__text">{cat.title}</span>
                            </button>
                        ))}
                    </div>

                    {activeCategory && (
                        <div className="age-sidebar__details">
                            <AgeOverviewPanel category={activeCategory} />
                        </div>
                    )}
                </div>
                {activeCategory?.imageCard && (
                    <div className="age-sidebar__badge-icon">
                        <Image
                            src={activeCategory.imageCard}
                            alt={`Icône pour ${activeCategory.title}`}
                            width={100}
                            height={100}
                            quality={100}
                        />
                    </div>
                )}
            </div>

        </div>
    );
}
