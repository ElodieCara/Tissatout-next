"use client";

import Image from "next/image";
import Link from "next/link";

interface Props {
    id: string;
    slug: string;
    title: string;
    ageRange: string;
    imageUrl: string;
    pdfUrl: string;
    pdfPrice?: number;
    themes?: string[];
    types?: string[];
}

export default function ActivityCard({
    slug,
    title,
    ageRange,
    imageUrl,
    pdfUrl,
    pdfPrice,
    themes,
    types,
}: Props) {
    const priceLabel =
        typeof pdfPrice === "number"
            ? pdfPrice === 0
                ? "Gratuit"
                : `${pdfPrice.toFixed(2)} €`
            : "Prix non défini";

    return (
        <article className="activity-card">
            <Link href={`/activites-a-imprimer/${slug}`} className="activity-card__link">
                <div className="activity-card__image-wrapper">
                    <Image
                        src={imageUrl}
                        alt={title}
                        width={400}
                        height={300}
                        className="activity-card__image"
                    />
                </div>
            </Link>

            <div className="activity-card__content">
                <div className="activity-card__tags activity-card__tags--top">
                    <span className="activity-card__tag activity-card__tag--age">{ageRange}</span>
                </div>

                <Link href={`/activites-a-imprimer/${slug}`}>
                    <h3 className="activity-card__title">{title}</h3>
                </Link>

                <p className="activity-card__price">{priceLabel}</p>

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

                <div className="activity-card__cta">
                    <Link
                        href={`/activites-a-imprimer/${slug}`}
                        className="activity-card__btn"
                    >
                        📂 Voir l’activité
                    </Link>
                </div>
            </div>
        </article>
    );
}
