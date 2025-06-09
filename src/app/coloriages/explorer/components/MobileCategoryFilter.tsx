"use client";

import { useEffect, useState } from "react";

export default function MobileCategoryFilter({
    categories,
    selectedTheme,
    onThemeSelect,
}: {
    categories: Record<string, string[]>;
    selectedTheme: string | null;
    onThemeSelect: (theme: string | null) => void;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const allCategories = ["Tous les coloriages", "Nouveautés", ...Object.keys(categories)];

    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    const handleSelect = (theme: string | null) => {
        onThemeSelect(theme);
        setIsOpen(false);
    };

    return (
        <div className="mobile-category-filter">
            <button
                className="mobile-category-filter__button"
                onClick={() => setIsOpen(true)}
            >
                Catégories
            </button>

            {isOpen && (
                <div
                    className="mobile-category-filter__overlay"
                    onClick={() => setIsOpen(false)}
                >
                    <div
                        className="mobile-category-filter__modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="mobile-category-filter__title">Catégories</h3>
                        <ul className="mobile-category-filter__list">
                            {allCategories.map((label) => (
                                <li key={label}>
                                    <button
                                        className={`mobile-category-filter__item ${selectedTheme === label ||
                                                (!selectedTheme && label === "Tous les coloriages")
                                                ? "active"
                                                : ""
                                            }`}
                                        onClick={() =>
                                            handleSelect(label === "Tous les coloriages" ? null : label)
                                        }
                                    >
                                        {label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                        <button
                            className="mobile-category-filter__close"
                            onClick={() => setIsOpen(false)}
                        >
                            ✕ Fermer
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
