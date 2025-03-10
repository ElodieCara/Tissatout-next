"use client";

import { useState, useEffect } from "react";
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

interface Drawing {
    id: string;
    imageUrl: string;
    title: string;
    views?: number;
    likes?: number;
    category?: string;
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

export default function ExplorerPage() {
    const searchParams = useSearchParams();
    const initialTheme = searchParams?.get("categorie") ?? null;

    // State management
    const [selectedTheme, setSelectedTheme] = useState<string | null>(initialTheme);
    const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);
    const [drawings, setDrawings] = useState<Drawing[]>([]);
    const [topImages, setTopImages] = useState<Record<string, { imageUrl: string; likes: number }>>({});
    const [coloringCounts, setColoringCounts] = useState<Record<string, number>>({});

    // Handle theme selection
    const handleThemeClick = (theme: string) => {
        setSelectedTheme(theme);
        setSelectedSubCategory(null);
    };

    // Handle subcategory selection and fetch drawings
    const handleSubCategoryClick = async (subCategory: string) => {
        setSelectedSubCategory(subCategory);
        fetchDrawingsByCategory(subCategory);
    };

    // Fetch drawings by category
    const fetchDrawingsByCategory = async (category: string) => {
        try {
            const res = await fetch(`/api/drawings?category=${encodeURIComponent(category)}`);
            const data = await res.json();
            console.log(`🎨 Dessins récupérés pour ${category}:`, data);
            setDrawings(data);
        } catch (error) {
            console.error("❌ Erreur lors du fetch des dessins :", error);
            setDrawings([]);
        }
    };

    // Fetch subcategory metadata when a theme is selected
    useEffect(() => {
        if (!selectedTheme || !categoriesData[selectedTheme]) return;

        const fetchSubcategoryData = async () => {
            const newTopImages: Record<string, { imageUrl: string; likes: number }> = {};
            const newColoringCounts: Record<string, number> = {};

            await Promise.all(
                categoriesData[selectedTheme].map(async (subCategory) => {
                    try {
                        // Fetch most liked drawing for this subcategory
                        const res = await fetch(`/api/drawings?category=${encodeURIComponent(subCategory)}&sort=likes&limit=1`);
                        const data = await res.json();
                        newTopImages[subCategory] = data.length > 0
                            ? { imageUrl: data[0].imageUrl, likes: data[0].likes ?? 0 }
                            : { imageUrl: "/images/default-placeholder.png", likes: 0 };

                        // Fetch drawing count for this subcategory
                        const countRes = await fetch(`/api/drawings/count?category=${encodeURIComponent(subCategory)}`);
                        const countData = await countRes.json();
                        newColoringCounts[subCategory] = countData.count || 0;
                    } catch (error) {
                        console.error(`❌ Erreur pour ${subCategory} :`, error);
                        newTopImages[subCategory] = { imageUrl: "/images/default-placeholder.png", likes: 0 };
                        newColoringCounts[subCategory] = 0;
                    }
                })
            );

            setTopImages(newTopImages);
            setColoringCounts(newColoringCounts);
        };

        fetchSubcategoryData();
    }, [selectedTheme]);

    return (
        <>
            <Head>
                <title>Explorer les coloriages - Tissatout</title>
            </Head>
            <Banner
                src="/assets/slide3.png"
                title="🎨 Bienvenue dans l'univers des coloriages !"
                description="Explorez des centaines de coloriages gratuits à imprimer."
            //onClick={() => setSelectedTheme('Tendances')}
            />
            <main className="explorer-container">
                <BackToTop />
                <ExplorerSidebar
                    categories={categoriesData}
                    selectedTheme={selectedTheme}
                    onThemeSelect={handleThemeClick}
                />
                <div className="explorer-content">
                    <Breadcrumb
                        selectedTheme={selectedTheme}
                        selectedSubCategory={selectedSubCategory}
                        onThemeSelect={setSelectedTheme}
                        onSubCategorySelect={setSelectedSubCategory}
                    />
                    {/* Display subcategories when a theme is selected but no subcategory is chosen */}
                    {selectedTheme && !selectedSubCategory && (
                        <div>
                            <h2>{selectedTheme}</h2>
                            <div className="explorer-grid">
                                {categoriesData[selectedTheme]?.map((subCategory) => (
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

                    Display drawings when a subcategory is selected
                    {selectedSubCategory && (
                        <div>
                            <h2>{selectedSubCategory}</h2>
                            <div className="explorer-grid">
                                {drawings.length > 0 ? (
                                    drawings.map((drawing) => (
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
                </div>

                {/* Display homepage content when no theme is selected */}
                {!selectedTheme && (
                    <div className="explorer-enhanced">
                        {/* Banner */}
                        <ExplorerBanner
                            imageUrl="/images/banner.jpg"
                            title="🎨 Découvrez les Meilleurs Coloriages !"
                            description="🌟 Tendances – Explorez les coloriages les plus appréciés du moment, aimés et téléchargés par notre communauté.
                                        🍂 Saisonnier – Trouvez des coloriages adaptés aux fêtes et aux saisons : Noël, Halloween, Printemps, Été et bien plus encore !
                                        📚 Éducatif – Apprenez en vous amusant avec nos coloriages pédagogiques basés sur le Trivium : grammaire, logique et rhétorique."
                            onClick={() => setSelectedTheme('Tendances')}
                        />

                        {/* Trending Section */}
                        <TrendingSection
                            showViews={true}  // ✅ Afficher les vues
                            showLikes={false} // ❌ Cacher les likes
                        />

                        {/* Seasonal Highlights */}
                        <SeasonalHighlights
                            showViews={false} // ❌ Cacher les vues
                            showLikes={true}  // ✅ Afficher les likes
                        />

                        {/* Educational Section */}
                        <EducationalSection />
                    </div>
                )}
            </main>
        </>
    );
}