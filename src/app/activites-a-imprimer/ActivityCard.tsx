"use client";

import Image from "next/image";
import Link from "next/link";

interface Props {
    id: string;
    title: string;
    ageRange: string;
    imageUrl: string;
    pdfUrl: string;
    pdfPrice?: number;
    printPrice?: number;
    isPrintable?: boolean;
    showPDFButton?: boolean;
    showPrintButton?: boolean;
    themes?: string[];
    types?: string[];
}

export default function ActivityCard({
    id,
    title,
    ageRange,
    imageUrl,
    pdfUrl,
    pdfPrice,
    printPrice,
    themes,
    types,
    isPrintable = false,
    showPDFButton = true,
    showPrintButton = false,
}: Props) {
    const price = showPrintButton && printPrice !== undefined
        ? `${printPrice.toFixed(2)} €`
        : pdfPrice !== undefined
            ? (pdfPrice === 0 ? "Gratuit" : `${pdfPrice.toFixed(2)} €`)
            : null;

    return (
        <article className="activity-card">
            <div className="activity-card__image-wrapper">
                <Image
                    src={imageUrl}
                    alt={title}
                    width={400}
                    height={300}
                    className="activity-card__image"
                />
            </div>

            <div className="activity-card__content">

                {/* Tag âge tout en haut */}
                <div className="activity-card__tags activity-card__tags--top">
                    <span className="activity-card__tag activity-card__tag--age">{ageRange}</span>
                </div>

                <h3 className="activity-card__title">{title}</h3>

                {price && (
                    <p className="activity-card__price">{price}</p>
                )}

                {/* Tags thèmes et types */}
                {(types?.length || themes?.length) && (
                    <div className="activity-card__tags">
                        {types?.map((type) => (
                            <span key={type} className="activity-card__tag">{type}</span>
                        ))}
                        {themes?.map((theme) => (
                            <span key={theme} className="activity-card__tag">{theme}</span>
                        ))}
                    </div>
                )}

                {/* Boutons CTA */}
                <div className="activity-card__cta">
                    {showPDFButton && (
                        <Link
                            href={pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="activity-card__btn"
                        >
                            {pdfPrice === 0 ? "📄 Télécharger PDF" : "🛒 Acheter sur Etsy"}
                        </Link>
                    )}

                    {showPrintButton && isPrintable && (
                        <Link
                            href={`/commande/${id}`}
                            className="activity-card__btn activity-card__btn--alt"
                        >
                            📦 Commander plastifiée
                        </Link>
                    )}
                </div>
            </div>
        </article>
    );
}
