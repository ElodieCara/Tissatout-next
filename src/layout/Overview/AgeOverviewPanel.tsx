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
                    📘 Activités {title.includes("10") ? "Quadrivium" : "Trivium"}
                </a>

                <a href={`/contenus/${slug}/articles`} className="age-panel__link age-panel__link--articles">
                    📰 Articles
                </a>

                <a href={`/contenus/${slug}/conseils`} className="age-panel__link age-panel__link--conseils">
                    🧸 Conseils
                </a>

                <a href={`/contenus/${slug}/idees`} className="age-panel__link age-panel__link--idees">
                    🎨 Idées créatives
                </a>

                <a href={`/contenus/${slug}/coloriages`} className="age-panel__link age-panel__link--coloriages">
                    🖍️ Coloriages
                </a>
            </div>
        </div>
    );
};

export default AgeOverviewPanel;
