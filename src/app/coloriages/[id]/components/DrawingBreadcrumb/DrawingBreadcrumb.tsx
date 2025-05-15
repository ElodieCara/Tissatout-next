"use client";

import Link from "next/link";

interface DrawingBreadcrumbProps {
    category?: string;
    drawingTitle?: string;
}

export default function DrawingBreadcrumb({ category, drawingTitle }: DrawingBreadcrumbProps) {
    return (
        <nav className="breadcrumb-page">
            <ul className="breadcrumb__list">
                {/* Accueil */}
                <li className="breadcrumb__item">
                    <Link className="breadcrumb__link" href="/"> Accueil</Link>
                </li>
                <span className="breadcrumb__separator"> &gt; </span>

                {/* Explorer */}
                <li className="breadcrumb__item">
                    <Link className="breadcrumb__link" href="/coloriages"> Explorer</Link>
                </li>

                {/* Catégorie */}
                {category && (
                    <>
                        <span className="breadcrumb__separator"> &gt; </span>
                        <li className="breadcrumb__item">
                            <Link className="breadcrumb__link" href={`/coloriages?categorie=${encodeURIComponent(category)}`}>
                                {category}
                            </Link>
                        </li>
                    </>
                )}

                {/* Nom du dessin (non cliquable) */}
                {drawingTitle && (
                    <>
                        <span className="breadcrumb__separator"> &gt; </span>
                        <li className="breadcrumb__current active"> {drawingTitle}</li>
                    </>
                )}
            </ul>
        </nav>
    );
}
