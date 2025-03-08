"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Head from "next/head";
import BackToTop from "@/components/BackToTop/BackToTop";
import FloatingIcons from "@/components/FloatingIcon/FloatingIcons";
import DrawingCard from "@/components/DrawingCard/DrawingCard";
import { Drawing } from "@/types/drawing";
import Link from "next/link";
import Banner from "@/components/Banner/Banner";


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
    const [trendingDrawings, setTrendingDrawings] = useState<Drawing[]>([]);
    const [topLikedDrawings, setTopLikedDrawings] = useState<Record<string, Drawing[]>>({});
    const [globalTopDrawings, setGlobalTopDrawings] = useState<Drawing[]>([]);
    const [educationalDrawings, setEducationalDrawings] = useState<Record<string, Drawing[]>>({});
    const [selectedTheme, setSelectedTheme] = useState<string | null>(initialTheme);
    const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);
    const [drawings, setDrawings] = useState<Drawing[]>([]);
    const [topImages, setTopImages] = useState<Record<string, { imageUrl: string; likes: number }>>({});
    const [coloringCounts, setColoringCounts] = useState<Record<string, number>>({});

    useEffect(() => {
        const fetchGlobalTopDrawings = async () => {
            try {
                // Récupérer les 4 dessins les plus likés toutes catégories confondues
                const res = await fetch(`/api/drawings?sort=likes&limit=4`);
                const data = await res.json();

                console.log("❤️ Dessins les plus likés globalement :", data); // DEBUG

                setGlobalTopDrawings(data);
            } catch (error) {
                console.error("❌ Erreur lors du fetch des dessins les plus likés globalement :", error);
            }
        };

        fetchGlobalTopDrawings();
    }, []);

    useEffect(() => {
        const fetchEducationalDrawings = async () => {
            const educationalCategory = "Éducatif & Trivium";
            const subCategories = {
                "Grammaire": categoriesData[educationalCategory]?.filter(cat => cat.startsWith("Grammaire"))[0],
                "Logique": categoriesData[educationalCategory]?.filter(cat => cat.startsWith("Logique"))[0],
                "Rhétorique": categoriesData[educationalCategory]?.filter(cat => cat.startsWith("Rhétorique"))[0]
            };

            const newEducationalDrawings: Record<string, Drawing[]> = {};

            try {
                // Pour chaque sous-catégorie, récupérer l'image la plus likée
                for (const [key, subCategory] of Object.entries(subCategories)) {
                    if (subCategory) {
                        const res = await fetch(`/api/drawings?category=${encodeURIComponent(subCategory)}&sort=likes&limit=1`);
                        const data = await res.json();
                        newEducationalDrawings[key] = data;
                    }
                }

                // Ajouter une 4ème sous-catégorie au hasard pour compléter
                const randomCategory = categoriesData[educationalCategory]?.find(
                    cat => !Object.values(subCategories).includes(cat)
                );

                if (randomCategory) {
                    const res = await fetch(`/api/drawings?category=${encodeURIComponent(randomCategory)}&sort=likes&limit=1`);
                    const data = await res.json();
                    newEducationalDrawings["Bonus"] = data;
                }

                console.log("🧠 Dessins éducatifs récupérés :", newEducationalDrawings);
                setEducationalDrawings(newEducationalDrawings);
            } catch (error) {
                console.error("❌ Erreur lors du fetch des dessins éducatifs :", error);
            }
        };

        fetchEducationalDrawings();
    }, []);

    useEffect(() => {
        if (!selectedTheme) return;

        const fetchDrawings = async () => {
            try {
                const res = await fetch(`/api/drawings?category=${encodeURIComponent(selectedTheme)}`);
                const data = await res.json();

                console.log("🔍 Dessins récupérés :", data); // DEBUG

                setDrawings(data);
            } catch (error) {
                console.error("❌ Erreur lors du fetch :", error);
            }
        };

        fetchDrawings();
    }, [selectedTheme]);

    // Effet séparé pour charger les tendances
    useEffect(() => {
        const fetchTrendingDrawings = async () => {
            try {
                // Récupérer les dessins les plus vus, sans filtre de catégorie
                const res = await fetch(`/api/drawings?sort=views&limit=4`);
                const data = await res.json();

                console.log("🔥 Tendances récupérées :", data); // DEBUG

                // Stockez-les dans un state séparé pour les tendances
                setTrendingDrawings(data);
            } catch (error) {
                console.error("❌ Erreur lors du fetch des tendances :", error);
            }
        };

        fetchTrendingDrawings();
    }, []); // Exécuté une seule fois au chargement


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

    useEffect(() => {
        const fetchTopLikedDrawings = async () => {
            const newTopLikedDrawings: Record<string, Drawing[]> = {};

            // Si Halloween est défini dans categoriesData
            if (categoriesData["Saisons et Fêtes"]?.includes("Halloween")) {
                await Promise.all(
                    // Vous pouvez remplacer ceci par les sous-catégories Halloween si elles existent
                    categoriesData["Saisons et Fêtes"]
                        .filter(cat => cat === "Halloween")
                        .map(async (subCategory) => {
                            try {
                                // Récupérer les 3 images les plus likées pour chaque sous-catégorie
                                const res = await fetch(`/api/drawings?category=${encodeURIComponent(subCategory)}&sort=likes&limit=3`);
                                const data = await res.json();
                                newTopLikedDrawings[subCategory] = data;
                            } catch (error) {
                                console.error(`❌ Erreur pour les likes de ${subCategory} :`, error);
                                newTopLikedDrawings[subCategory] = [];
                            }
                        })
                );
            }

            setTopLikedDrawings(newTopLikedDrawings);
        };

        fetchTopLikedDrawings();
    }, []);

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
    console.log("🎨 Données des dessins :", drawings);

    return (
        <>
            <Head>
                <title>Explorer les coloriages - Tissatout</title>
            </Head>
            <Banner
                src="/assets/slide3.png"
                title="💡 Inspiration & Conseils"
                description="Trouvez des idées d’activités et des conseils adaptés à chaque saison et moment clé du développement !"
            />
            <main className="explorer-container">
                <BackToTop />
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
                                {/* 🔍 Moteur de recherche */}
                                <div className="search-bar">
                                    <input type="text" placeholder="🔍 Rechercher un coloriage..." />
                                </div>
                            </div>
                        </div>

                        {/* 2️⃣ Section "Tendances" */}
                        <div className="trending-section">
                            <h2>🔥 Tendances</h2>
                            <div className="explorer-grid">
                                {trendingDrawings.length > 0 ? (
                                    trendingDrawings
                                        .map((drawing) => (
                                            <Link key={drawing.id} href={`/coloriages/${drawing.id}`}>
                                                <DrawingCard
                                                    id={drawing.id}
                                                    imageUrl={drawing.imageUrl}
                                                    theme={drawing.title}
                                                    views={drawing.views ?? 0}
                                                    likeCount={drawing.likes ?? 0}
                                                    showButton={false}
                                                />
                                            </Link>
                                        ))
                                ) : (
                                    <p>⏳ Chargement des tendances...</p>
                                )}
                            </div>
                        </div>



                        {/* 3️⃣ Sélection des "Coups de cœur" selon la saison */}
                        <div className="seasonal-highlights">
                            <h2>📌 Coups de cœur</h2>
                            <p>Découvrez nos coloriages les plus appréciés par la communauté ❤️</p>

                            <div className="explorer-grid">
                                {globalTopDrawings && globalTopDrawings.length > 0 ? (
                                    globalTopDrawings.map((drawing: Drawing) => (
                                        <Link key={drawing.id} href={`/coloriages/${drawing.id}`}>
                                            <DrawingCard
                                                id={drawing.id}
                                                imageUrl={drawing.imageUrl}
                                                theme={drawing.title}
                                                views={drawing.views ?? 0}
                                                likeCount={drawing.likes ?? 0}
                                                showButton={false}
                                            />
                                        </Link>
                                    ))
                                ) : (
                                    <p>⏳ Chargement des coloriages les plus appréciés...</p>
                                )}
                            </div>

                            {/* Vous pouvez conserver cette partie si vous souhaitez aussi afficher les sous-catégories */}
                            {/* <div className="explorer-grid">
                                {categoriesData["Saisons et Fêtes"]?.filter(cat => cat === "Halloween").map((subCategory: string) => (
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
                            </div> */}
                        </div>


                        {/* 4️⃣ Section éducative */}
                        <div className="educational-section">
                            <h2>🧠 Apprendre en s'amusant</h2>
                            <p>Découvrez nos coloriages éducatifs pour apprendre les lettres, les chiffres et bien plus encore !</p>

                            <div className="explorer-grid">
                                {Object.entries(educationalDrawings).map(([category, drawings]) => (
                                    drawings.length > 0 && (
                                        <Link key={drawings[0].id} href={`/coloriages/${drawings[0].id}`}>
                                            <DrawingCard
                                                id={drawings[0].id}
                                                imageUrl={drawings[0]?.imageUrl || "/images/default-placeholder.png"}
                                                theme={category}
                                                views={drawings[0]?.views ?? 0}
                                                likeCount={drawings[0]?.likes ?? 0}
                                                showButton={true}
                                            />
                                        </Link>
                                    )
                                ))}
                            </div>
                        </div>
                    </div>
                )}

            </main>
        </>
    );
}
