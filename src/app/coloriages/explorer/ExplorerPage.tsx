"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import BackToTop from "@/components/BackToTop/BackToTop";
import ExplorerSidebar from "./components/ExplorerSidebar";
import DrawingCard from "@/components/DrawingCard/DrawingCard";
import ExplorerBanner from "./components/ExplorerBanner";
import TrendingSection from "./components/TrendingSection";
import EducationalSection from "./components/EducationalSection";
import SeasonalHighlights from "./components/SeasonalHightlights";
import Breadcrumb from "../../../components/Breadcrumb/Breadcrumb";
import Button from "../../../components/Button/Button";
import { Drawing } from "@/types/drawing";
import { generateSlug } from "@/lib/utils";

interface ExplorerPageProps {
    educationalDrawings: Record<string, Drawing[]>;
    drawingsByCategory: Record<string, Drawing[]>;
    topImages: Record<string, { imageUrl: string; likes: number }>;
    coloringCounts: Record<string, number>;
    topLikedDrawings: Drawing[];
    trendingDrawings: Drawing[];
    coloringBanner: string;
    coloringTitle: string;
    coloringDesc: string;
}

const categoriesData: Record<string, string[]> = {
    "Saisons et Fêtes": ["Hiver", "Printemps", "Été", "Automne", "Noël", "Halloween", "Pâques"],
    "Thèmes": ["Animaux", "Véhicules", "Espace", "Pirates"],
    "Âge": ["Tout Petits (0-3 ans)", "Dès 3 ans", "Dès 6 ans", "Dès 10 ans"],
    "Trivium & Quadrivium": [
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
    trendingDrawings
}: ExplorerPageProps) {
    const searchParams = useSearchParams();
    const initialTheme = searchParams?.get("categorie") ?? null;
    const allDrawings = Object.values(drawingsByCategory).flat();
    const [selectedTheme, setSelectedTheme] = useState<string | null>(initialTheme);
    const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);

    useEffect(() => {
        const theme = searchParams?.get("categorie") ?? null;
        const sub = searchParams?.get("sub") ?? null;

        setSelectedTheme(theme);
        setSelectedSubCategory(sub);
    }, [searchParams]);

    const handleThemeClick = (theme: string | null) => {
        setSelectedTheme(theme);
        setSelectedSubCategory(null);
    };

    const handleSubCategoryClick = (subCategory: string) => {
        setSelectedSubCategory(subCategory);
    };

    const filteredDrawings =
        selectedTheme === "Nouveautés"
            ? allDrawings
                .filter((drawing) => {
                    const createdAt = new Date(drawing.createdAt);
                    const sevenDaysAgo = new Date();
                    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                    return createdAt >= sevenDaysAgo;
                })
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            : selectedTheme && drawingsByCategory[selectedTheme]
                ? drawingsByCategory[selectedTheme]
                : null;

    return (
        <>
            <main className="explorer-container">
                <BackToTop />
                <ExplorerSidebar
                    categories={categoriesData}
                    selectedTheme={selectedTheme}
                    onThemeSelect={handleThemeClick}
                />

                <div className="explorer-content">
                    {/* 🎨 Banner toujours visible en haut */}
                    <div className="explorer-banner-wrapper">
                        <ExplorerBanner
                            title="Des coloriages malins pour apprendre en s’amusant"
                            description="Explorez nos tendances, nos coloriages saisonniers et éducatifs !"
                        />
                        <Button href="/coloriages" className="cta-button">
                            ← Retour à l’accueil des coloriages
                        </Button>
                    </div>

                    <Breadcrumb
                        crumbs={[
                            { label: "Accueil", href: "/" },
                            { label: "Coloriages", href: "/coloriages" },
                            ...(selectedTheme ? [{ label: selectedTheme, href: `?categorie=${selectedTheme}` }] : []),
                            ...(selectedSubCategory ? [{ label: selectedSubCategory }] : [])
                        ]}
                    />

                    {/* Sous-catégories */}
                    {selectedTheme && !selectedSubCategory && (
                        <div className="explorer-enhanced">
                            <h2>{selectedTheme}</h2>

                            {/* Paragraphe explicatif pour les nouveautés */}
                            {selectedTheme === "Nouveautés" && (
                                <p className="explorer-subtitle">
                                    Découvrez les derniers coloriages ajoutés cette semaine !
                                </p>
                            )}

                            <div className="explorer-grid">
                                {selectedTheme === "Nouveautés"
                                    ? filteredDrawings && filteredDrawings.length > 0
                                        ? filteredDrawings.map((drawing) => (
                                            <DrawingCard
                                                key={drawing.id}
                                                id={drawing.id}
                                                imageUrl={drawing.imageUrl}
                                                theme={drawing.title}
                                                views={drawing.views ?? 0}
                                                likeCount={drawing.likes ?? 0}
                                                slug={drawing.slug ?? generateSlug(drawing.title, drawing.id)}
                                            />
                                        ))
                                        : <p>⏳ Aucun nouveau coloriage publié récemment.</p>
                                    : categoriesData[selectedTheme]?.map((subCategory) => (
                                        <div key={subCategory} className="sub-category-card">
                                            <img
                                                src={topImages[subCategory]?.imageUrl || "/images/default-placeholder.png"}
                                                alt={subCategory}
                                                className="sub-category-image"
                                            />
                                            <h3>{subCategory}</h3>
                                            <p>{coloringCounts[subCategory] || 0} coloriages disponibles</p>
                                            <button className="see-more" onClick={() => handleSubCategoryClick(subCategory)}>
                                                Voir plus
                                            </button>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    )}

                    {/* Coloriages de la sous-catégorie */}
                    {selectedSubCategory && (
                        <div className="explorer-enhanced">
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
                                            slug={drawing.slug ?? generateSlug(drawing.title, drawing.id)}
                                            isNew={true}
                                        />
                                    ))
                                ) : (
                                    <p>⏳ Aucun coloriage disponible pour cette catégorie.</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Page d'accueil des coloriages */}
                    {!selectedTheme && (
                        <div className="explorer-enhanced">
                            <TrendingSection trendingDrawings={trendingDrawings} />
                            <SeasonalHighlights showViews={false} showLikes={true} topLikedDrawings={topLikedDrawings} />
                            <EducationalSection educationalDrawings={educationalDrawings} />
                        </div>
                    )}
                </div>
            </main >
        </>
    );
}
