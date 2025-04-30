"use client";

import React, { useState, useEffect } from "react";
import ThemeIcon from "@/components/Decorations/Themes/ThemeIcon";
import { useTheme } from "@/components/Decorations/Themes/ThemeProvider";
import Image from "next/image";
import Button from "@/components/Button/Button";
import { Link } from "lucide-react";
import SidebarAgeMobile from "@/components/SidebarAgeMobile/SidebarAgeMobile";
import AgeOverviewPanel from "./AgeOverviewPanel";

interface AgeCategory {
    id: string;
    slug: string;
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
    const [mobileOpen, setMobileOpen] = useState(false);
    const { theme } = useTheme();
    const [isAgeSidebarOpen, setIsAgeSidebarOpen] = useState(false);

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
        setMobileOpen(false);
    };

    if (!activeCategory) return null;

    return (
        <div className="container__section" style={{ position: "relative" }} key={theme}>
            {/* Sidebar Mobile Button */}
            {/* <div className="mobile-topbar">
                <button className="mobile-topbar__button" onClick={() => setMobileOpen(true)}>
                    Ouvrir les catégories
                </button>
                <SidebarAgeMobile isOpen={isAgeSidebarOpen} onClose={() => setIsAgeSidebarOpen(false)} />
            </div> */}

            {/* Mobile Sidebar Overlay */}
            {/* {mobileOpen && (
                <div className="mobile-sidebar__overlay" onClick={() => setMobileOpen(false)}>
                    <div className="mobile-sidebar" onClick={(e) => e.stopPropagation()}>
                        <button className="close-button" onClick={() => setMobileOpen(false)}>✖️</button>
                        <h2>Catégories d'âge</h2>
                        {ageCategories.map((category) => (
                            <div key={category.id} className="mobile-sidebar__link" onClick={() => handleSidebarClick(category)}>
                                {category.title}
                            </div>
                        ))}
                        <h2>Inspiration</h2>
                        <Link className="mobile-sidebar__link" href="/conseils">Conseils</Link>
                        <Link className="mobile-sidebar__link" href="/idees">Idées</Link>
                        <Link className="mobile-sidebar__link" href="/articles">Articles</Link>
                    </div>
                </div>
            )} */}

            {/* Sidebar Mobile Button */}
            <div className="mobile-topbar">
                <button className="mobile-topbar__button" onClick={() => setIsAgeSidebarOpen(true)}>
                    Ouvrir les catégories
                </button>
            </div>

            {/* SidebarAgeMobile Slide-in */}
            <SidebarAgeMobile
                isOpen={isAgeSidebarOpen}
                onClose={() => setIsAgeSidebarOpen(false)}
            />


            {/* Desktop Sidebar */}
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

            {/* Content Panel */}
            <div className="container__section__card-2">
                <ThemeIcon theme={theme} />


                <div className="container__section__card-2__content-panel">
                    <div className="container__section__card-2__content-panel__tag"></div>

                    <div className="container__section__card-2__content-panel__text">
                        <h3>{activeCategory?.title ?? "Titre indisponible"}</h3>

                        {/* <Button
                            className="activities-button yellow-button"
                            href={`/nos-univers/${encodeURIComponent(activeCategory?.title || "")}`}
                        >
                            Explorer
                        </Button> */}

                        <p className="description">{activeCategory?.description ?? "Description non disponible."}</p>
                        <p className="content">{activeCategory?.content ?? "Description non disponible."}</p>
                        <AgeOverviewPanel category={activeCategory} />
                        {/* {Array.isArray(activeCategory?.activities) && activeCategory.activities.length > 0 ? (
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
                        ) : null} */}
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
