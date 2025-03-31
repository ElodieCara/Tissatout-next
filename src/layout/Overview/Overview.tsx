"use client";

import React, { useState, useEffect } from "react";
import ThemeIcon from "@/components/Decorations/Themes/ThemeIcon";
import { useTheme } from "@/components/Decorations/Themes/ThemeProvider";
import Image from "next/image";
import Button from "@/components/Button/Button";

interface AgeCategory {
    id: string;
    title: string;
    description: string;
    imageCard: string;
    imageBanner: string;
    activities: string[];
    conclusion?: string;
    content?: string;
    activityList?: string[];
}

const Overview: React.FC = () => {
    const [ageCategories, setAgeCategories] = useState<AgeCategory[]>([]);
    const [activeCategory, setActiveCategory] = useState<AgeCategory | null>(null);
    const { theme } = useTheme();

    useEffect(() => {
        const fetchCategories = async () => {
            const res = await fetch("/api/ageCategory");
            const data = await res.json();
            setAgeCategories(data);
            setActiveCategory(data[0]);
        };

        fetchCategories();
    }, []);

    const handleSidebarClick = (category: AgeCategory) => {
        setActiveCategory(category);
    };

    if (!activeCategory) return null;

    return (
        <div className="container__section" style={{ position: "relative" }} key={theme}>
            <div className="container__section__card-1">
                <ul className="container__section__card-1__sidebar">
                    {ageCategories.map((category, index) => (
                        <li
                            key={category.id}
                            className={`container__section__card-1__sidebar__button container__section__card-1__sidebar__button--${category.title.replace(/\s+/g, "").toLowerCase()}`}
                            onClick={() => handleSidebarClick(category)}
                        >
                            <div className="sidebar__button__image">
                                <Image
                                    src={category.imageCard}
                                    alt={category.title}
                                    width={40}
                                    height={40}
                                    style={{ borderRadius: "8px" }}
                                    quality={100}
                                />
                            </div>
                            <span className="sidebar__button__title">{category.title}</span>
                        </li>

                    ))}
                </ul>
            </div>

            <div className="container__section__card-2">
                <ThemeIcon theme={theme} />
                <div className="container__section__card-2__content-panel">
                    <div className="container__section__card-2__content-panel__tag"></div>

                    <div className="container__section__card-2__content-panel__text">
                        <h3>{activeCategory?.title ?? "Titre indisponible"}</h3>

                        <Button
                            className="activities-button yellow-button"
                            href={`/nos-univers/${encodeURIComponent(activeCategory?.title || "")}`}
                        >
                            Explorer
                        </Button>

                        <p className="description">{activeCategory?.description ?? "Description non disponible."}</p>

                        {Array.isArray(activeCategory?.activities) && activeCategory.activities.length > 0 ? (
                            <ul className="activities-list">
                                {activeCategory.activities.map((activity, index) => (
                                    <li key={index} className="activities-list__item">
                                        <span>{activity}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : Array.isArray(activeCategory?.activityList) && activeCategory.activityList.length > 0 ? (
                            <ul className="activities-list">
                                {activeCategory.activityList.map((activity: string, index: number) => (
                                    <li key={index} className="activities-list__item">
                                        <span>{activity}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : null}
                        {activeCategory?.conclusion && (
                            <p className="conclusion">{activeCategory.conclusion}</p>
                        )}
                    </div>

                    <div className="container__section__card-2__content-panel__img">
                        <Image
                            src={activeCategory.imageCard}
                            alt="Image de la section"
                            fill
                            quality={100}
                            sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Overview;
