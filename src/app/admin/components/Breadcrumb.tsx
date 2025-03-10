"use client";
import Link from "next/link";

interface BreadcrumbProps {
    selectedTheme?: string | null;
    selectedSubCategory?: string | null;
    onThemeSelect: (theme: string | null) => void;
    onSubCategorySelect: (subCategory: string | null) => void;
}

export default function Breadcrumb({ selectedTheme, selectedSubCategory, onThemeSelect, onSubCategorySelect }: BreadcrumbProps) {
    return (
        <nav className="breadcrumb">
            <ul>
                {/* Accueil */}
                <li>
                    <span onClick={() => { onThemeSelect(null); onSubCategorySelect(null); }}>🏠 Accueil</span>
                </li>

                {/* Thème sélectionné */}
                {selectedTheme && (
                    <>
                        <span className="breadcrumb__separator"> &gt; </span>
                        <li>
                            <span onClick={() => { onThemeSelect(selectedTheme); onSubCategorySelect(null); }}>
                                {selectedTheme}
                            </span>
                        </li>
                    </>
                )}

                {/* Sous-catégorie sélectionnée */}
                {selectedSubCategory && (
                    <>
                        <span className="breadcrumb__separator"> &gt; </span>
                        <li>
                            <span className="active">{selectedSubCategory}</span>
                        </li>
                    </>
                )}
            </ul>
        </nav>
    );
}
