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
import MobileCategoryFilter from "./components/MobileCategoryFilter";

interface ExplorerPageProps {
    educationalDrawings: Record<string, Drawing[]>;
    drawingsByCategory: Record<string, Drawing[]>;
    topImages: Record<string, { imageUrl: string; likes: number }>;
    coloringCounts: Record<string, number>;
    topLikedDrawings: Drawing[];
    trendingDrawings: Drawing[];
    categoriesData: Record<string, string[]>;
    coloringBanner: string;
    coloringTitle: string;
    coloringDesc: string;
}

export default function ExplorerPage({
    categoriesData,
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

    // État pour gérer l'affichage des coloriages avec limite
    const [displayLimit, setDisplayLimit] = useState<number>(12); // Limite initiale de 12 coloriages
    const INCREMENT = 12; // Nombre de coloriages à ajouter à chaque clic

    useEffect(() => {
        const theme = searchParams?.get("categorie") ?? null;
        const sub = searchParams?.get("sub") ?? null;

        setSelectedTheme(theme);
        setSelectedSubCategory(sub);

        // Réinitialiser la limite quand on change de sous-catégorie
        setDisplayLimit(12);
    }, [searchParams]);

    const handleThemeClick = (theme: string | null) => {
        setSelectedTheme(theme);
        setSelectedSubCategory(null);
        setDisplayLimit(12); // Réinitialiser la limite
    };

    const handleSubCategoryClick = (subCategory: string) => {
        setSelectedSubCategory(subCategory);
        setDisplayLimit(12); // Réinitialiser la limite
    };

    const handleLoadMore = () => {
        setDisplayLimit(prev => prev + INCREMENT);
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
                <div className="explorer-layout">
                    <BackToTop />

                    <Breadcrumb
                        crumbs={[
                            { label: "Accueil", href: "/" },
                            { label: "Coloriages", href: "/coloriages" },
                            ...(selectedTheme ? [{ label: selectedTheme, href: `?categorie=${selectedTheme}` }] : []),
                            ...(selectedSubCategory ? [{ label: selectedSubCategory }] : [])
                        ]}
                    />
                </div>
                <ExplorerSidebar
                    categories={categoriesData}
                    selectedTheme={selectedTheme}
                    onThemeSelect={handleThemeClick}
                />
                <div className="explorer-content">
                    {/* 🎨 Banner toujours visible en haut */}
                    <div className="explorer-banner-wrapper">
                        <ExplorerBanner
                            title="Des coloriages malins pour apprendre en s'amusant"
                            description="Explorez nos tendances, nos coloriages saisonniers et éducatifs !"
                        />
                        <Button href="/coloriages" className="cta-button">
                            ← Retour à l&apos;accueil des coloriages
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
                    <MobileCategoryFilter
                        categories={categoriesData}
                        selectedTheme={selectedTheme}
                        onThemeSelect={handleThemeClick}
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

                    {/* Coloriages de la sous-catégorie avec limite d'affichage */}
                    {selectedSubCategory && (
                        <div className="explorer-enhanced">
                            <h2>{selectedSubCategory}</h2>
                            <div className="explorer-grid">
                                {drawingsByCategory[selectedSubCategory]?.length > 0 ? (
                                    <>
                                        {drawingsByCategory[selectedSubCategory]
                                            .slice(0, displayLimit) // Limiter l'affichage
                                            .map((drawing) => (
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
                                            ))}
                                    </>
                                ) : (
                                    <p>⏳ Aucun coloriage disponible pour cette catégorie.</p>
                                )}
                            </div>

                            {/* Bouton "Voir plus" si il y a plus de coloriages à afficher */}
                            {drawingsByCategory[selectedSubCategory]?.length > displayLimit && (
                                <div className="load-more-container" style={{ textAlign: 'center', marginTop: '2rem' }}>
                                    <button
                                        onClick={handleLoadMore}
                                        className="load-more-button"
                                        style={{
                                            padding: '12px 24px',
                                            backgroundColor: '#2c3f64',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '8px',
                                            fontSize: '16px',
                                            cursor: 'pointer',
                                            transition: 'background-color 0.3s ease'
                                        }}
                                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2c3f64'}
                                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#293347'}
                                    >
                                        Voir plus ({drawingsByCategory[selectedSubCategory].length - displayLimit} restants)
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {!selectedTheme && (
                        <div className="explorer-intro">
                            <h1>Explorer tous nos coloriages à imprimer</h1>
                            <p>
                                Bienvenue dans notre grande collection de coloriages à imprimer, pensés pour éveiller l’imagination des enfants de 3 à 10 ans.
                                Ici, chaque dessin est une porte ouverte vers un moment calme, créatif et joyeux. Parcourez nos thèmes : saisons, fêtes, animaux,
                                contes et bien plus. Téléchargez, imprimez, coloriez — et gardez précieusement les œuvres de vos petites mains.
                            </p>
                            <p>
                                Tous nos coloriages sont gratuits et classés par âge et par thème. Vous trouverez des coloriages pour Noël, Saisons, Pâques,
                                mais aussi pour apprendre en s&apos;amusant : lettres, chiffres, formes et nature.
                                Une activité simple pour occuper les enfants à la maison, à l’école ou pendant les vacances.
                            </p>
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