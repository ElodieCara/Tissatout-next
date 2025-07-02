"use client";

import Image from "next/image";
import React from "react";

interface AgeOverviewPanelProps {
    category: {
        title: string;
        description?: string;
        slug: string;
        imageCard?: string;
    };
}

const AgeOverviewPanel: React.FC<AgeOverviewPanelProps> = ({ category }) => {
    if (!category) return null;

    const { title, description, slug, imageCard } = category;

    return (
        <div className="age-panel">
            <div className="age-panel__links">
                <a
                    href={`/contenus/${slug}/${title.includes("10") ? "quadrivium" : "trivium"}`}
                    className="age-panel__link age-panel__link--trivium"
                >
                    <Image
                        src="/icons/titres/quadrivium.png"
                        alt="Trivium"
                        width={24}
                        height={24}
                    />
                    Activités {title.includes("10") ? "Quadrivium" : "Trivium"}
                </a>

                <a href={`/contenus/${slug}/articles`} className="age-panel__link age-panel__link--articles">
                    <Image
                        className="age-panel__link-icon"
                        src="/icons/titres/livre.png"
                        alt="Articles"
                        width={24}
                        height={24}
                    />
                    Articles
                </a>

                <a href={`/contenus/${slug}/conseils`} className="age-panel__link age-panel__link--conseils">
                    <Image
                        src="/icons/titres/nounours.png"
                        alt="Conseils"
                        width={24}
                        height={24}
                    />
                    Conseils
                </a>

                <a href={`/contenus/${slug}/idees`} className="age-panel__link age-panel__link--idees">
                    <Image
                        src="/icons/titres/cible.png"
                        alt="Idées créatives"
                        width={24}
                        height={24}
                    />
                    Idées créatives
                </a>

                <a href={`/contenus/${slug}/coloriages`} className="age-panel__link age-panel__link--coloriages">
                    <Image
                        src="/icons/titres/coloriages.png"
                        alt="Coloriages"
                        width={24}
                        height={24}
                    />
                    Coloriages
                </a>
            </div>
        </div>
    );
};

export default AgeOverviewPanel;
