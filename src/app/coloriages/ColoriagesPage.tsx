"use client";

import BackToTop from "@/components/BackToTop/BackToTop";
import Link from "next/link";
import Banner from "@/components/Banner/Banner";
import DrawingCard from "@/components/DrawingCard/DrawingCard";
import { Drawing } from "@/types/drawing";
import { generateSlug } from "@/lib/utils";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";


// 🎯 Gestion des catégories et sous-catégories
const categoriesData = {
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

// 🔥 Détection de la saison actuelle pour afficher les coloriages correspondants
const getCurrentSeason = () => {
    const month = new Date().getMonth() + 1; // Janvier = 1, Février = 2...
    if ([12, 1, 2].includes(month)) return "Hiver";
    if ([3, 4, 5].includes(month)) return "Printemps";
    if ([6, 7, 8].includes(month)) return "Été";
    if ([9, 10, 11].includes(month)) return "Automne";
    return "Été";
};

const isNew = (createdAt: string | number | Date) => {
    const createdDate = new Date(createdAt);
    if (isNaN(createdDate.getTime())) return false; // date invalide
    const daysSinceCreation = (Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24);
    return daysSinceCreation <= 7;
};


export default function ColoriagePage({
    drawings,
    coloringBanner,
    coloringTitle,
    coloringDesc
}: {
    drawings: Drawing[],
    coloringBanner: string,
    coloringTitle: string,
    coloringDesc: string
}) {
    const currentSeason = getCurrentSeason();

    return (
        <>
            <header className="coloriages__header">
                <Banner
                    src={coloringBanner}
                    title={coloringTitle}
                    description={coloringDesc}
                    buttons={[
                        { label: "Explorer tous les coloriages", href: "/coloriages/explorer" },
                        { label: "Commencer par l’âge", targetId: "ages" },
                        { label: "Rechercher un thème", targetId: "themes" },
                        { label: "Approche éducative", targetId: "educatif" }
                    ]}
                />
            </header>

            {/* <FloatingIcons /> */}
            <main className="coloriages__container">
                <BackToTop />
                <Breadcrumb
                    crumbs={[
                        { label: "Accueil", href: "/" },
                        { label: "Coloriages", href: "/coloriages" },
                    ]}
                />
                {/* 1️⃣ Coloriages Nouveautés */}
                <section id="nouveautes" className="coloriages__theme-section">
                    <div className="coloriages__theme-section-title">
                        <img src="/icons/titres/crayons.png" alt="" />
                        <h2>Nouveaux coloriages</h2>
                        <Link href="/coloriages/explorer?tri=nouveaux" className="section-button">
                            Voir tous les nouveaux
                        </Link>
                    </div>

                    <p>Découvre les dernières illustrations ajoutées récemment.</p>
                    <div className="coloriages__theme-grid">
                        {drawings
                            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                            .slice(0, 4)
                            .map((drawing) => (
                                <DrawingCard
                                    key={drawing.id}
                                    id={drawing.id}
                                    imageUrl={drawing.imageUrl}
                                    theme={drawing.title}
                                    views={drawing.views ?? 0}
                                    likeCount={drawing.likes ?? 0}
                                    slug={drawing.slug || generateSlug(drawing.title, drawing.id)}
                                />
                            ))}
                    </div>
                </section>

                {/* 1️⃣ Coloriages de saison */}
                <section id="saisons" className="coloriages__theme-section">
                    <div className="coloriages__theme-section-title" >
                        <img src="/icons/titres/crayons.png" alt="" />
                        <h2>Coloriages de {currentSeason}</h2>
                        <Link
                            href={`/coloriages/explorer?categorie=${encodeURIComponent("Saisons et Fêtes")}&sub=${encodeURIComponent(currentSeason)}`}
                            className="section-button"
                        >
                            Explorer cette saison
                        </Link>
                    </div>

                    <p>Retrouvez les coloriages liés à la saison actuelle et aux fêtes du moment.</p>
                    <div className="coloriages__theme-grid">
                        {drawings
                            .filter(d => d.category?.name === currentSeason)
                            .slice(0, 4)
                            .map(drawing => (
                                <DrawingCard
                                    key={drawing.id}
                                    id={drawing.id}
                                    imageUrl={drawing.imageUrl}
                                    theme={drawing.title}
                                    views={drawing.views ?? 0}
                                    likeCount={drawing.likes ?? 0}
                                    slug={drawing.slug || generateSlug(drawing.title, drawing.id)} />
                            ))}
                    </div>
                </section>

                {/* 2️⃣ Coloriages par thème */}
                <section id="themes" className="coloriages__theme-section">
                    <div className="coloriages__theme-section-title" >
                        <img src="/icons/titres/coloriages.png" alt="" />
                        <h2>Coloriages par thème</h2>
                        <Link
                            href={`/coloriages/explorer?categorie=${encodeURIComponent("Thèmes")}`}
                            className="section-button"
                        >
                            Explorer ce thème
                        </Link>
                    </div>
                    {categoriesData.Thèmes.map((theme) => (
                        <div key={theme}>
                            <h3>🖍 {theme}</h3>
                            <div className="coloriages__theme-grid">
                                {drawings
                                    .filter(d => d.category?.name === theme)
                                    .slice(0, 4)
                                    .map(drawing => (
                                        <DrawingCard key={drawing.id} id={drawing.id} imageUrl={drawing.imageUrl} theme={drawing.title} views={drawing.views ?? 0} likeCount={drawing.likes ?? 0} slug={drawing.slug || generateSlug(drawing.title, drawing.id)} />
                                    ))}
                            </div>
                        </div>
                    ))}
                </section>

                {/* 3️⃣ Coloriages par âge */}
                <section id="ages" className="coloriages__theme-section">
                    <div className="coloriages__theme-section-title" >
                        <img src="/icons/titres/nounours.png" alt="" />
                        <h2> Coloriages par âge</h2>
                        <Link
                            href={`/coloriages/explorer?categorie=${encodeURIComponent("Âge")}`}
                            className="section-button"
                        >
                            Explorer cette tranche d’âge
                        </Link>

                    </div>
                    {Object.entries(categoriesData["Âge"]).map(([label, category]) => (
                        <div key={category}>
                            <h3>🖍 {label}</h3>
                            <div className="coloriages__theme-grid">
                                {drawings
                                    .filter(d => d.category?.name === category)
                                    .slice(0, 4)
                                    .map(drawing => (
                                        <DrawingCard key={drawing.id} id={drawing.id} imageUrl={drawing.imageUrl} theme={drawing.title} views={drawing.views ?? 0} likeCount={drawing.likes ?? 0} slug={drawing.slug || generateSlug(drawing.title, drawing.id)} />
                                    ))}
                            </div>
                        </div>
                    ))}
                </section>

                {/* 4️⃣ Coloriages éducatifs (Trivium) 📚 */}
                <section id="educatif" className="coloriages__theme-section">
                    <div className="coloriages__theme-section-title" >
                        <img src="/icons/titres/livre.png" alt="" />
                        <h2>Coloriages éducatifs (Trivium & Quadrivium)</h2>
                        <Link
                            href={`/coloriages/explorer?categorie=${encodeURIComponent("Trivium & Quadrivium")}`}
                            className="section-button"
                        >
                            Explorer cette section
                        </Link>
                    </div>
                    {categoriesData["Trivium & Quadrivium"].map(sub => {
                        const subDrawings = drawings.filter(d => d.category?.name === sub).slice(0, 4);
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
                                                likeCount={drawing.likes ?? 0}
                                                slug={drawing.slug || generateSlug(drawing.title, drawing.id)}
                                            />
                                        ))
                                    ) : (
                                        <p>Aucun coloriage disponible pour cette catégorie.</p> // Si jamais une catégorie est vide
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
