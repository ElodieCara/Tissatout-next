"use client";

import Link from "next/link";

interface DrawingBreadcrumbProps {
    category?: string;
    drawingTitle?: string;
}

export default function DrawingBreadcrumb({ category, drawingTitle }: DrawingBreadcrumbProps) {
    return (
        <nav className="breadcrumb">
            <ul>
                {/* Accueil */}
                <li>
                    <Link href="/">🏠 Accueil</Link>
                </li>
                <span className="breadcrumb__separator"> &gt; </span>

                {/* Explorer */}
                <li>
                    <Link href="/coloriages">📚 Explorer</Link>
                </li>

                {/* Catégorie */}
                {category && (
                    <>
                        <span className="breadcrumb__separator"> &gt; </span>
                        <li>
                            <Link href={`/coloriages?categorie=${encodeURIComponent(category)}`}>
                                📂 {category}
                            </Link>
                        </li>
                    </>
                )}

                {/* Nom du dessin (non cliquable) */}
                {drawingTitle && (
                    <>
                        <span className="breadcrumb__separator"> &gt; </span>
                        <li className="active">🖼️ {drawingTitle}</li>
                    </>
                )}
            </ul>
        </nav>
    );
}
