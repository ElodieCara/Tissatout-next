"use client";

import BackToTop from "@/components/BackToTop/BackToTop";
import FloatingIcons from "@/components/FloatingIcon/FloatingIcons";
import Banner from "@/components/Banner/Banner";
import Head from "next/head";
import DrawingCard from "@/components/DrawingCard/DrawingCard";
import { useEffect, useState } from "react";
import { Drawing } from "@/types/drawing";

export default function ColoragesPage() {
    const [drawings, setDrawings] = useState<Drawing[]>([]);

    useEffect(() => {
        fetch("/api/drawings")
            .then((res) => {
                console.log("🔍 Réponse brute de l'API :", res);
                return res.json();
            })
            .then((data) => {
                console.log("📥 Données reçues :", data);
                setDrawings(data);
            })
            .catch((error) => {
                console.error("❌ Erreur lors du fetch :", error);
            });
    }, []);


    // 🎨 Filtrage des coloriages par catégorie
    const themesDrawings = drawings.filter(d => d.category?.name === "Thèmes");
    const trendingDrawings = drawings.sort((a, b) => b.views - a.views).slice(0, 6); // 🔥 Top 6 tendances
    const educativeDrawings = drawings.filter(d => d.category?.name === "Éducatif");

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
                    description="Découvrez des centaines de coloriages à imprimer et à colorier ! Choisissez parmi des thèmes variés : animaux, mandalas, héros, saisons et bien plus encore. Inspirez-vous, amusez-vous et libérez votre créativité ! 🎨"
                    buttons={[
                        { label: "🎨 Explorer les thèmes", targetId: "themes" },
                        { label: "🔥 Voir les tendances", targetId: "tendances" },
                        { label: "📚 Coloriages éducatifs", targetId: "educatif" }
                    ]}
                />
            </header>

            <main className="coloriages__container">
                <FloatingIcons />
                <BackToTop />
                <section id="themes" className="coloriages__theme-explorer">
                    <h2>🎨 Explorez nos thèmes</h2>
                    <p>Découvrez une variété de coloriages classés par thèmes : animaux, nature, mandalas...</p>
                    <div className="coloriages__theme-explorer__grid">
                        {themesDrawings.map((drawing) => (
                            <DrawingCard
                                key={drawing.id}
                                imageUrl={drawing.imageUrl}
                                theme={drawing.category?.name || "Inconnu"}
                                views={drawing.views ?? 0}
                            />
                        ))}
                    </div>
                </section>

                <section id="tendances" className="coloriages__theme-tendances">
                    <h2>🔥 Les tendances du moment</h2>
                    <p>Voici les coloriages les plus populaires en ce moment, imprimés par des milliers d’enfants et parents.</p>
                    <div className="coloriages__theme-tendances__grid">
                        {trendingDrawings.map((drawing) => (
                            <DrawingCard
                                key={drawing.id}
                                imageUrl={drawing.imageUrl}
                                theme={drawing.category?.name || "Inconnu"}
                                views={drawing.views ?? 0}
                            />
                        ))}
                    </div>
                </section>

                <section id="educatif" className="coloriages__theme-educatifs">
                    <h2>📚 Coloriages éducatifs</h2>
                    <p>Apprenez en coloriant ! Lettres, chiffres, logique et bien plus encore.</p>
                    <div className="coloriages__theme-educatifs__grid">
                        {educativeDrawings.map((drawing) => (
                            <DrawingCard
                                key={drawing.id}
                                imageUrl={drawing.imageUrl}
                                theme={drawing.category?.name || "Inconnu"}
                                views={drawing.views ?? 0}
                            />
                        ))}
                    </div>
                </section>

            </main>
        </>
    );
}
