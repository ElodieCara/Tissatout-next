"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Head from "next/head";
import BackToTop from "@/components/BackToTop/BackToTop";
import ExplorerSidebar from "./components/ExplorerSidebar";
import DrawingCard from "@/components/DrawingCard/DrawingCard";
import Banner from "@/components/Banner/Banner";
import ExplorerBanner from "./components/ExplorerBanner";
import TrendingSection from "./components/TrendingSection";
import EducationalSection from "./components/EducationalSection";
import SeasonalHighlights from "./components/SeasonalHightlights";
import Breadcrumb from "@/app/admin/components/Breadcrumb";
import { Drawing } from "@/types/drawing";

interface ExplorerPageProps {
    educationalDrawings: Record<string, Drawing[]>;
    drawingsByCategory: Record<string, Drawing[]>;
    topImages: Record<string, { imageUrl: string; likes: number }>;
    coloringCounts: Record<string, number>;
    topLikedDrawings: Drawing[];
    trendingDrawings: Drawing[];
}

const categoriesData: Record<string, string[]> = {
    "Saisons et Fêtes": ["Hiver", "Printemps", "Été", "Automne", "Noël", "Halloween", "Pâques"],
    "Thèmes": ["Animaux", "Véhicules", "Espace", "Pirates"],
    "Âge": ["Tout Petits (0-3 ans)", "Dès 3 ans", "Dès 6 ans", "Dès 10 ans"],
    "Éducatif & Trivium": [
        "Grammaire - Lettres",
        "Grammaire - Mots",
        "Grammaire - Chiffres",
        "Logique - Puzzle",
        "Logique - Coloriages numérotés",
        "Logique - Labyrinthe",
        "Rhétorique - Histoires",
        "Rhétorique - Mythologie",
        "Rhétorique - Philosophie"
    ]
};

export default function ExplorerPage({
    educationalDrawings,
    drawingsByCategory,
    topImages,
    coloringCounts,
    topLikedDrawings,
    trendingDrawings,
}: ExplorerPageProps) {
    const searchParams = useSearchParams();
    const initialTheme = searchParams?.get("categorie") ?? null;

    const [selectedTheme, setSelectedTheme] = useState<string | null>(initialTheme);
    const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);

    // Gestion des clics sur catégories et sous-catégories
    const handleThemeClick = (theme: string) => {
        setSelectedTheme(theme);
        setSelectedSubCategory(null);
    };

    const handleSubCategoryClick = (subCategory: string) => {
        setSelectedSubCategory(subCategory);
    };

    return (
        <>
            <Head>
                <title>Explorer les coloriages - Tissatout</title>
            </Head>
            <Banner src="/assets/slide3.png" title="🎨 Bienvenue dans l'univers des coloriages !" description="Explorez des centaines de coloriages gratuits à imprimer." />

            <main className="explorer-container">
                <BackToTop />
                <ExplorerSidebar categories={categoriesData} selectedTheme={selectedTheme} onThemeSelect={handleThemeClick} />
                <div className="explorer-content">
                    <Breadcrumb
                        selectedTheme={selectedTheme}
                        selectedSubCategory={selectedSubCategory}
                        onThemeSelect={setSelectedTheme}
                        onSubCategorySelect={setSelectedSubCategory}
                    />
                    {/* Affichage des sous-catégories */}
                    {selectedTheme && !selectedSubCategory && (
                        <div>
                            <h2>{selectedTheme}</h2>
                            <div className="explorer-grid">
                                {categoriesData[selectedTheme]?.map((subCategory) => (
                                    <div key={subCategory} className="sub-category-card">
                                        <img src={topImages[subCategory]?.imageUrl || "/images/default-placeholder.png"} alt={subCategory} className="sub-category-image" />
                                        <h3>{subCategory}</h3>
                                        <p>{coloringCounts[subCategory] || 0} coloriages disponibles</p>
                                        <button className="see-more" onClick={() => handleSubCategoryClick(subCategory)}>Voir plus</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Affichage des coloriages de la sous-catégorie sélectionnée */}
                    {selectedSubCategory && (
                        <div>
                            <h2>{selectedSubCategory}</h2>
                            <div className="explorer-grid">
                                {drawingsByCategory[selectedSubCategory]?.length > 0 ? (
                                    drawingsByCategory[selectedSubCategory].map((drawing) => (
                                        <DrawingCard
                                            key={drawing.id}
                                            id={drawing.id}
                                            imageUrl={drawing.imageUrl}
                                            theme={drawing.title}
                                            views={drawing.views ?? 0}
                                            likeCount={drawing.likes ?? 0}
                                        />
                                    ))
                                ) : (
                                    <p>⏳ Aucun coloriage disponible pour cette catégorie.</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Contenu de la page d'accueil */}
                    {!selectedTheme && (
                        <div className="explorer-enhanced">
                            <ExplorerBanner imageUrl="/images/banner.jpg" title="🎨 Découvrez les Meilleurs Coloriages !" description="Explorez nos tendances, nos coloriages saisonniers et éducatifs !" onClick={() => setSelectedTheme('Tendances')} />
                            <TrendingSection trendingDrawings={trendingDrawings} />                            <SeasonalHighlights showViews={false} showLikes={true} topLikedDrawings={topLikedDrawings} />
                            <EducationalSection educationalDrawings={educationalDrawings} />
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}
