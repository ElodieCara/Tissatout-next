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
            {/* <h3 className="age-panel__title">{title}</h3>

            <p className="age-panel__description">{description}</p> */}

            <div className="age-panel__links">
                <a href={`/trivium/${slug}`} className="age-panel__link age-panel__link--trivium">
                    📘 Activités Trivium
                </a>
                <a href={`/articles?age=${slug}`} className="age-panel__link age-panel__link--articles">
                    📰 Articles
                </a>
                {/* <a href={`/conseils?age=${slug}`} className="age-panel__link age-panel__link--conseils">
                    💡 Conseils
                </a> */}
                <a href={`/idees?age=${slug}`} className="age-panel__link age-panel__link--idees">
                    🎨 Idées créatives
                </a>
                <a href={`/coloriages?age=${slug}`} className="age-panel__link age-panel__link--coloriages">
                    🖍️ Coloriages
                </a>
            </div>

            {/* {imageCard && (
                <div className="age-panel__image">
                    <Image
                        src={imageCard}
                        alt={`Image de ${title}`}
                        fill
                        quality={100}
                        style={{ objectFit: "contain" }}
                    />
                </div>
            )} */}
        </div>
    );
};

export default AgeOverviewPanel;
