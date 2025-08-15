"use client";

import BackToTop from "@/components/BackToTop/BackToTop";
import Link from "next/link";
import Banner from "@/components/Banner/Banner";
import DrawingCard from "@/components/DrawingCard/DrawingCard";
import { Drawing } from "@/types/drawing";
import { Category } from "@/types/category";
import { generateSlug } from "@/lib/utils";

type Props = {
    drawings: Drawing[],
    coloringBanner: string,
    coloringTitle: string,
    coloringDesc: string,
    themes: Category[],
    ages: Category[],
    educatif: Category[]  // ✅ Renommé pour plus de clarté
};

// Saison logique (inchangé)
const getCurrentSeason = () => {
    const month = new Date().getMonth() + 1;
    if ([12, 1, 2].includes(month)) return "Hiver";
    if ([3, 4, 5].includes(month)) return "Printemps";
    if ([6, 7, 8].includes(month)) return "Été";
    if ([9, 10, 11].includes(month)) return "Automne";
    return "Été";
};

export default function ColoriagePage({
    drawings,
    coloringBanner,
    coloringTitle,
    coloringDesc,
    themes,
    ages,
    educatif  // ✅ Renommé
}: Props) {
    const currentSeason = getCurrentSeason();

    // 🔍 Debug pour comprendre la structure des données
    console.log("ÉDUCATIF categories:", educatif);
    console.log("DRAWINGS sample:", drawings.slice(0, 2));

    // 🔧 Fonction helper pour filtrer les dessins par nom de catégorie
    const filterDrawingsByCategory = (drawings: Drawing[], categoryName: string) => {
        return drawings.filter(drawing => {
            // La category dans Drawing ne contient que le name, pas l'id
            return drawing.category?.name === categoryName;
        });
    };

    return (
        <>
            <header className="coloriages__header">
                <Banner
                    src={coloringBanner}
                    title={coloringTitle}
                    description={coloringDesc}
                    buttons={[
                        { label: "Explorer tous les coloriages", href: "/coloriages/explorer" },
                        { label: "Commencer par l'âge", targetId: "ages" },
                        { label: "Rechercher un thème", targetId: "themes" },
                        { label: "Approche éducative", targetId: "educatif" }
                    ]}
                />
            </header>
            <main className="coloriages__container">
                <BackToTop />

                {/* Nouveautés */}
                <section id="nouveautes" className="coloriages__theme-section">
                    <div className="coloriages__theme-section-title">
                        <img src="/icons/titres/crayons.png" alt="" />
                        <h2>Nouveaux coloriages</h2>
                        <Link href="/coloriages/explorer?categorie=Nouveautés" className="section-button">
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

                {/* Saison */}
                <section id="saisons" className="coloriages__theme-section">
                    <div className="coloriages__theme-section-title">
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
                            .filter(d => {
                                if (d.category && typeof d.category === 'object' && 'name' in d.category) {
                                    return d.category.name === currentSeason;
                                }
                                return false;
                            })
                            .slice(0, 4)
                            .map(drawing => (
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

                {/* Thèmes */}
                <section id="themes" className="coloriages__theme-section">
                    <div className="coloriages__theme-section-title">
                        <img src="/icons/titres/coloriages.png" alt="" />
                        <h2>Coloriages par thème</h2>
                        <Link
                            href={`/coloriages/explorer?categorie=${encodeURIComponent("Thèmes")}`}
                            className="section-button"
                        >
                            Explorer ce thème
                        </Link>
                    </div>
                    {themes.map((theme) => {
                        const themeDrawings = filterDrawingsByCategory(drawings, theme.name);
                        return (
                            <div key={theme.id}>
                                <h3>🖍 {theme.name}</h3>
                                <div className="coloriages__theme-grid">
                                    {themeDrawings.slice(0, 4).map(drawing => (
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
                                {themeDrawings.length === 0 && (
                                    <p>Aucun coloriage disponible pour cette catégorie.</p>
                                )}
                            </div>
                        );
                    })}
                </section>

                {/* Âge */}
                <section id="ages" className="coloriages__theme-section">
                    <div className="coloriages__theme-section-title">
                        <img src="/icons/titres/nounours.png" alt="" />
                        <h2>Coloriages par âge</h2>
                        <Link
                            href={`/coloriages/explorer?categorie=${encodeURIComponent("Âge")}`}
                            className="section-button"
                        >
                            Explorer cette tranche d&apos;âge
                        </Link>
                    </div>
                    {ages.map((age) => {
                        const ageDrawings = filterDrawingsByCategory(drawings, age.name);
                        return (
                            <div key={age.id}>
                                <h3>🖍 {age.name}</h3>
                                <div className="coloriages__theme-grid">
                                    {ageDrawings.slice(0, 4).map(drawing => (
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
                                {ageDrawings.length === 0 && (
                                    <p>Aucun coloriage disponible pour cette catégorie.</p>
                                )}
                            </div>
                        );
                    })}
                </section>

                {/* Trivium & Quadrivium - SECTION ÉDUCATIVE */}
                <section id="educatif" className="coloriages__theme-section">
                    <div className="coloriages__theme-section-title">
                        <img src="/icons/titres/livre.png" alt="" />
                        <h2>Coloriages éducatifs (Trivium & Quadrivium)</h2>
                        <Link
                            href={`/coloriages/explorer?categorie=${encodeURIComponent("Trivium & Quadrivium")}`}
                            className="section-button"
                        >
                            Explorer cette section
                        </Link>
                    </div>
                    <p className="section-description">
                        Découvrez nos coloriages éducatifs basés sur le Trivium (grammaire, logique, rhétorique)
                        et le Quadrivium (arithmétique, géométrie, musique, astronomie).
                    </p>

                    {/* Coloriages Grammaire (Trivium) */}
                    <div className="category-subsection">
                        <h3>🖍 Grammaire</h3>
                        <div className="coloriages__theme-grid">
                            {(() => {
                                const grammaireDrawings = drawings.filter(d =>
                                    d.category?.name?.toLowerCase().includes('grammaire') ||
                                    d.category?.name?.toLowerCase().includes('lettres') ||
                                    d.category?.name?.toLowerCase().includes('mots') ||
                                    d.category?.name?.toLowerCase().includes('chiffres')
                                ).slice(0, 4);

                                console.log('Grammaire drawings found:', grammaireDrawings.length);
                                console.log('Grammaire categories found:', grammaireDrawings.map(d => d.category?.name));

                                return grammaireDrawings.length > 0 ? (
                                    grammaireDrawings.map(drawing => (
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
                                    <div className="no-content-message">
                                        <p>Aucun coloriage Grammaire disponible pour le moment.</p>
                                    </div>
                                );
                            })()}
                        </div>
                    </div>

                    {/* Coloriages Logique (Trivium) */}
                    <div className="category-subsection">
                        <h3>🖍 Logique</h3>
                        <div className="coloriages__theme-grid">
                            {(() => {
                                const logiqueDrawings = drawings.filter(d =>
                                    d.category?.name?.toLowerCase().includes('logique') ||
                                    d.category?.name?.toLowerCase().includes('puzzle') ||
                                    d.category?.name?.toLowerCase().includes('labyrinthe') ||
                                    d.category?.name?.toLowerCase().includes('numéroté')
                                ).slice(0, 4);

                                console.log('Logique drawings found:', logiqueDrawings.length);
                                console.log('Logique categories found:', logiqueDrawings.map(d => d.category?.name));

                                return logiqueDrawings.length > 0 ? (
                                    logiqueDrawings.map(drawing => (
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
                                    <div className="no-content-message">
                                        <p>Aucun coloriage Logique disponible pour le moment.</p>
                                    </div>
                                );
                            })()}
                        </div>
                    </div>

                    {/* Coloriages Rhétorique (Trivium) */}
                    <div className="category-subsection">
                        <h3>🖍 Rhétorique</h3>
                        <div className="coloriages__theme-grid">
                            {(() => {
                                const rhetoriqueDrawings = drawings.filter(d =>
                                    d.category?.name?.toLowerCase().includes('rhétorique') ||
                                    d.category?.name?.toLowerCase().includes('histoires') ||
                                    d.category?.name?.toLowerCase().includes('mythologie') ||
                                    d.category?.name?.toLowerCase().includes('philosophie')
                                ).slice(0, 4);

                                console.log('Rhétorique drawings found:', rhetoriqueDrawings.length);
                                console.log('Rhétorique categories found:', rhetoriqueDrawings.map(d => d.category?.name));

                                return rhetoriqueDrawings.length > 0 ? (
                                    rhetoriqueDrawings.map(drawing => (
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
                                    <div className="no-content-message">
                                        <p>Aucun coloriage Rhétorique disponible pour le moment.</p>
                                    </div>
                                );
                            })()}
                        </div>
                    </div>

                    {/* Debug info pour voir toutes les catégories
                    {process.env.NODE_ENV === 'development' && (
                        <div className="debug-info" style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f0f0f0', fontSize: '12px' }}>
                            <p><strong>Debug - Toutes les catégories trouvées :</strong></p>
                            {Array.from(new Set(drawings.map(d => d.category?.name).filter(Boolean))).sort().map(categoryName => (
                                <div key={categoryName} style={{ marginBottom: '5px', padding: '2px 6px', backgroundColor: '#ddd' }}>
                                    {categoryName}
                                </div>
                            ))}
                            <p><strong>Total drawings:</strong> {drawings.length}</p>
                        </div>
                    )} */}
                </section>
            </main>
        </>
    );
}