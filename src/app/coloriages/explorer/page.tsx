"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Head from "next/head";
import BackToTop from "@/components/BackToTop/BackToTop";
import FloatingIcons from "@/components/FloatingIcon/FloatingIcons";
import DrawingCard from "@/components/DrawingCard/DrawingCard";
import { Drawing } from "@/types/drawing";
import Link from "next/link";


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


    const [selectedTheme, setSelectedTheme] = useState<string | null>(initialTheme);
    const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);
    const [drawings, setDrawings] = useState<Drawing[]>([]);
    const [topImages, setTopImages] = useState<Record<string, { imageUrl: string; likes: number }>>({});
    const [coloringCounts, setColoringCounts] = useState<Record<string, number>>({});

    useEffect(() => {
        if (!selectedTheme) return;

        const fetchDrawings = async () => {
            try {
                const res = await fetch(`/api/drawings?category=${encodeURIComponent(selectedTheme)}`);
                const data = await res.json();
                setDrawings(data);
            } catch (error) {
                console.error("❌ Erreur lors du fetch :", error);
            }
        };

        fetchDrawings();
    }, [selectedTheme]);

    useEffect(() => {
        if (!selectedTheme) return;

        const fetchData = async () => {
            const newTopImages: Record<string, { imageUrl: string; likes: number }> = {};
            const newColoringCounts: Record<string, number> = {};

            await Promise.all(
                categoriesData[selectedTheme].map(async (subCategory) => {
                    try {
                        // ✅ Récupérer l'image la plus likée
                        const res = await fetch(`/api/drawings?category=${encodeURIComponent(subCategory)}&sort=likes&limit=1`);
                        const data = await res.json();
                        newTopImages[subCategory] = data.length > 0
                            ? { imageUrl: data[0].imageUrl, likes: data[0].likes ?? 0 }
                            : { imageUrl: "/images/default-placeholder.png", likes: 0 };

                        // ✅ Récupérer le nombre total de coloriages
                        const countRes = await fetch(`/api/drawings/count?category=${encodeURIComponent(subCategory)}`);
                        const countData = await countRes.json();
                        newColoringCounts[subCategory] = countData.count || 0;
                    } catch (error) {
                        console.error(`❌ Erreur pour ${subCategory} :`, error);
                    }
                })
            );

            setTopImages(newTopImages);
            setColoringCounts(newColoringCounts);
        };

        fetchData();
    }, [selectedTheme]);

    const handleThemeClick = (theme: string) => {
        setSelectedTheme(theme);
        setSelectedSubCategory(null);
    };

    const handleSubCategoryClick = async (subCategory: string) => {
        setSelectedSubCategory(subCategory);
        try {
            const res = await fetch(`/api/drawings?category=${encodeURIComponent(subCategory)}`);
            const data = await res.json();
            setDrawings(data);
        } catch (error) {
            console.error("❌ Erreur lors du fetch des dessins :", error);
        }
    };

    return (
        <>
            <Head>
                <title>Explorer les coloriages - Tissatout</title>
            </Head>
            <main className="explorer-container">
                <aside className="sidebar">
                    <h3>Catégories</h3>
                    <ul>
                        {Object.keys(categoriesData).map((theme) => (
                            <li key={theme} className={selectedTheme === theme ? "active" : ""}>
                                <button onClick={() => handleThemeClick(theme)}>{theme}</button>
                            </li>
                        ))}
                    </ul>
                </aside>

                <div className="explorer-content">
                    {/* ✅ N'affiche le contenu QUE si une catégorie est sélectionnée */}
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
                                        <p>❤️ {topImages[subCategory]?.likes ?? 0} likes</p>
                                        <p>{coloringCounts[subCategory] || 0} coloriages disponibles</p>
                                        <button className="see-more" onClick={() => handleSubCategoryClick(subCategory)}>
                                            Voir plus
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {selectedSubCategory && (
                        <div>
                            <h2>{selectedSubCategory}</h2>
                            <div className="explorer-grid">
                                {drawings.length > 0 ? (
                                    drawings.map((drawing) => (
                                        <Link key={drawing.id} href={`/coloriages/${drawing.id}`}>
                                            <DrawingCard
                                                id={drawing.id}
                                                imageUrl={drawing.imageUrl}
                                                theme={drawing.title}
                                                views={drawing.views ?? 0}
                                                likeCount={drawing.likes ?? 0}
                                            />
                                        </Link>
                                    ))
                                ) : (
                                    <p>⏳ Aucun coloriage disponible pour cette catégorie.</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* ✅ Masquer cette section si une catégorie est sélectionnée */}
                {!selectedTheme && (
                    <div className="explorer-enhanced">
                        {/* 1️⃣ Bannière attrayante */}
                        <div className="explorer-banner">
                            <img src="/images/banner.jpg" alt="Bannière" className="banner-image" />
                            <div className="banner-content">
                                <h1>🎨 Bienvenue dans l’univers des coloriages !</h1>
                                <p>Explorez des centaines de coloriages gratuits à imprimer.</p>
                                <p>Découvrez nos catégories et trouvez votre prochain dessin à colorier !</p>
                                <button className="cta-button" onClick={() => setSelectedTheme('Tendances')}>
                                    Explorer les coloriages
                                </button>
                            </div>
                        </div>

                        {/* 2️⃣ Section "Tendances" */}
                        <div className="trending-section">
                            <h2>🔥 Tendances</h2>
                            <div className="explorer-grid">
                                {drawings.slice(0, 5).map((drawing: Drawing) => (
                                    <Link key={drawing.id} href={`/coloriages/${drawing.id}`}>
                                        <DrawingCard
                                            id={drawing.id}
                                            imageUrl={drawing.imageUrl}
                                            theme={drawing.title}
                                            views={drawing.views ?? 0}
                                            likeCount={drawing.likes ?? 0}
                                        />
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* 3️⃣ Sélection des "Coups de cœur" selon la saison */}
                        <div className="seasonal-highlights">
                            <h2>📌 Coups de cœur</h2>
                            <p>🎃 C’est bientôt Halloween ! Découvrez nos coloriages effrayants 👻</p>
                            <div className="explorer-grid">
                                {categoriesData["Halloween"]?.map((subCategory: string) => (
                                    <div key={subCategory} className="sub-category-card">
                                        <img
                                            src={topImages[subCategory]?.imageUrl || "/images/default-placeholder.png"}
                                            alt={subCategory}
                                            className="sub-category-image"
                                        />
                                        <h3>{subCategory}</h3>
                                        <p>❤️ {topImages[subCategory]?.likes ?? 0} likes</p>
                                        <p>{coloringCounts[subCategory] || 0} coloriages disponibles</p>
                                        <button className="see-more" onClick={() => handleSubCategoryClick(subCategory)}>
                                            Voir plus
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 4️⃣ Moteur de recherche */}
                        <div className="search-bar">
                            <input type="text" placeholder="🔍 Rechercher un coloriage..." />
                        </div>

                        {/* 5️⃣ Section éducative */}
                        <div className="educational-section">
                            <h2>🧠 Apprendre en s’amusant</h2>
                            <p>Découvrez nos coloriages éducatifs pour apprendre les lettres, les chiffres et bien plus encore !</p>
                        </div>
                    </div>
                )}

                <FloatingIcons />
                <BackToTop />
            </main>
        </>
    );
}
