"use client";

import { useEffect, useState } from "react";
import Head from "next/head";
import BackToTop from "@/components/BackToTop/BackToTop";
import FloatingIcons from "@/components/FloatingIcon/FloatingIcons";
import Banner from "@/components/Banner/Banner";
import DrawingCard from "@/components/DrawingCard/DrawingCard";
import { Drawing } from "@/types/drawing";

// 🎯 Gestion des catégories et sous-catégories
const categoriesData = {
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

// 🔥 Détection de la saison actuelle pour afficher les coloriages correspondants
const getCurrentSeason = () => {
    const month = new Date().getMonth() + 1; // Janvier = 1, Février = 2...
    if ([12, 1, 2].includes(month)) return "Hiver";
    if ([3, 4, 5].includes(month)) return "Printemps";
    if ([6, 7, 8].includes(month)) return "Été";
    if ([9, 10, 11].includes(month)) return "Automne";
    return "Été";
};

export default function ColoragesPage() {
    const [drawings, setDrawings] = useState<Drawing[]>([]);
    const currentSeason = getCurrentSeason();

    useEffect(() => {
        fetch("/api/drawings")
            .then((res) => res.json())
            .then((data) => {
                console.log("📥 Données API reçues :", data); // 🔍 Vérifie les catégories des coloriages
                setDrawings(data);
            })
            .catch((error) => console.error("❌ Erreur lors du fetch :", error));
    }, []);


    return (
        <>
            <Head>
                <title>Coloriages à imprimer ✨ - Dessins gratuits à télécharger</title>
                <meta name="description" content="Découvrez des centaines de coloriages à imprimer et à colorier ! Thèmes variés : animaux, mandalas, héros, saisons et bien plus encore. Imprimez gratuitement !" />
                <meta name="keywords" content="coloriage à imprimer, dessin à colorier, coloriage enfant, mandalas, héros, saison" />
                <meta property="og:title" content="Coloriages à imprimer ✨ - Dessins gratuits à télécharger" />
                <meta property="og:description" content="Des centaines de coloriages gratuits à imprimer et à colorier. Explorez nos thèmes : animaux, mandalas, héros et bien plus encore !" />
                <meta property="og:image" content="/assets/slide3.png" />
                <meta property="og:url" content="https://ton-site.com/coloriages" />
                <meta name="twitter:card" content="summary_large_image" />
            </Head>

            <header className="coloriages__header">
                <Banner
                    src="/assets/slide3.png"
                    title="💡 Coloriages à imprimer"
                    description="Découvrez des centaines de coloriages à imprimer et à colorier ! Choisissez parmi des thèmes variés : animaux, mandalas, héros, saisons et bien plus encore."
                    buttons={[
                        { label: "📅 Explorer les coloriages", href: "/coloriages/explorer" }, // ✅ Redirection externe
                        { label: "🔍 Rechercher un thème", targetId: "themes" }, // ✅ Scroll vers section
                    ]}
                />
            </header>



            <main className="coloriages__container">
                <FloatingIcons />
                <BackToTop />

                {/* 1️⃣ Coloriages de saison */}
                <section id="saisons" className="coloriages__theme-section">
                    <h2>📅 Coloriages de {currentSeason}</h2>
                    <p>Retrouvez les coloriages liés à la saison actuelle et aux fêtes du moment.</p>
                    <div className="coloriages__theme-grid">
                        {drawings
                            .filter(d => d.category?.name === currentSeason)
                            .map(drawing => (
                                <DrawingCard key={drawing.id} id={drawing.id} imageUrl={drawing.imageUrl} theme={drawing.title} views={drawing.views ?? 0} likes={drawing.likes ?? 0} />
                            ))}
                    </div>
                </section>

                {/* 2️⃣ Coloriages par thème */}
                <section id="themes" className="coloriages__theme-section">
                    <h2>🎨 Coloriages par thème</h2>
                    {categoriesData.Thèmes.map((theme) => (
                        <div key={theme}>
                            <h3>🖍 {theme}</h3>
                            <div className="coloriages__theme-grid">
                                {drawings
                                    .filter(d => d.category?.name === theme)
                                    .map(drawing => (
                                        <DrawingCard key={drawing.id} id={drawing.id} imageUrl={drawing.imageUrl} theme={drawing.title} views={drawing.views ?? 0} likes={drawing.likes ?? 0} />
                                    ))}
                            </div>
                        </div>
                    ))}
                </section>

                {/* 3️⃣ Coloriages par âge */}
                <section id="ages" className="coloriages__theme-section">
                    <h2>👶 Coloriages par âge</h2>
                    {Object.entries(categoriesData["Âge"]).map(([label, category]) => (
                        <div key={category}>
                            <h3>🖍 {label}</h3>
                            <div className="coloriages__theme-grid">
                                {drawings
                                    .filter(d => d.category?.name === category)
                                    .map(drawing => (
                                        <DrawingCard key={drawing.id} id={drawing.id} imageUrl={drawing.imageUrl} theme={drawing.title} views={drawing.views ?? 0} likes={drawing.likes ?? 0} />
                                    ))}
                            </div>
                        </div>
                    ))}
                </section>

                {/* 4️⃣ Coloriages éducatifs (Trivium) 📚 */}
                <section id="educatif" className="coloriages__theme-section">
                    <h2>📚 Coloriages éducatifs (Trivium)</h2>

                    {categoriesData["Éducatif & Trivium"].map(sub => {
                        const subDrawings = drawings.filter(d => d.category?.name === sub);
                        console.log(`🖍 ${sub} ->`, subDrawings); // 🔍 Vérifie si les coloriages sont bien récupérés

                        return (
                            <div key={sub}>
                                <h3>🖍 {sub}</h3>
                                <div className="coloriages__theme-grid">
                                    {subDrawings.length > 0 ? (
                                        subDrawings.map(drawing => (
                                            <DrawingCard
                                                key={drawing.id}
                                                id={drawing.id}
                                                imageUrl={drawing.imageUrl}
                                                theme={drawing.title}
                                                views={drawing.views ?? 0}
                                                likes={drawing.likes ?? 0}
                                            />
                                        ))
                                    ) : (
                                        <p>⏳ Aucun coloriage disponible pour le moment...</p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </section>



            </main>
        </>
    );
}
