"use client";

import Image from "next/image";
import Link from "next/link";

interface AgeOverviewPanelProps {
    category: {
        title: string;
        description?: string;
        slug: string;
        imageCard?: string;
    };
}

export default function AgeOverviewPanel({ category }: AgeOverviewPanelProps) {
    if (!category) return null;

    const { title, description, slug, imageCard } = category;
    const skillPath = title.includes("10") ? "quadrivium" : "trivium";

    return (
        <div className="age-panel">
            <header className="age-panel__header">
                {imageCard && (
                    <Image
                        src={imageCard}
                        alt={title}
                        width={40}
                        height={40}
                        className="age-panel__thumb"
                    />
                )}
                {/* <h4 className="age-panel__title">{title}</h4>
                {description && <p className="age-panel__desc">{description}</p>} */}
            </header>

            <div className="age-panel__links">
                <Link
                    href={`/contenus/${slug}/${skillPath}`}
                    className="age-panel__link age-panel__link--trivium"
                >
                    <Image
                        src="/icons/titres/quadrivium.png"
                        alt="Trivium / Quadrivium"
                        width={24}
                        height={24}
                    />
                    <span>Activités {skillPath === "quadrivium" ? "Quadrivium" : "Trivium"}</span>
                </Link>

                <Link
                    href={`/contenus/${slug}/articles`}
                    className="age-panel__link age-panel__link--articles"
                >
                    <Image src="/icons/titres/livre.png" alt="Articles" width={24} height={24} />
                    <span>Articles</span>
                </Link>

                <Link
                    href={`/contenus/${slug}/conseils`}
                    className="age-panel__link age-panel__link--conseils"
                >
                    <Image src="/icons/titres/nounours.png" alt="Conseils" width={24} height={24} />
                    <span>Conseils</span>
                </Link>

                <Link
                    href={`/contenus/${slug}/idees`}
                    className="age-panel__link age-panel__link--idees"
                >
                    <Image src="/icons/titres/cible.png" alt="Idées créatives" width={24} height={24} />
                    <span>Idées créatives</span>
                </Link>

                <Link
                    href={`/contenus/${slug}/coloriages`}
                    className="age-panel__link age-panel__link--coloriages"
                >
                    <Image src="/icons/titres/coloriages.png" alt="Coloriages" width={24} height={24} />
                    <span>Coloriages</span>
                </Link>
            </div>
        </div>
    );
}
