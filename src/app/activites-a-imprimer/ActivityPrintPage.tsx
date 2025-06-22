"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Banner from "@/components/Banner/Banner";
import ActivityCard from "./ActivityCard";
import ActivityFilter from "./ActivityFilters";
import BackToTop from "@/components/BackToTop/BackToTop";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import { FullPrintable } from "@/lib/printables";
import MysteryTeaser from "./MysteryTeaser";
import MysteryActivityCard from "./MysteryActivityCard";

interface ActivityPrintPageProps {
    games: FullPrintable[];
}

interface PrintableGame {
    id: string;
    slug: string;
    title: string;
    imageUrl: string;
    pdfUrl: string;
    pdfPrice?: number;
    printPrice?: number;
    isPrintable: boolean;
    ageMin: number;
    ageMax: number;
    themes?: { theme: { label: string } }[];
    types?: { type: { label: string } }[];
    isMystery: boolean;
    mysteryUntil: string | null;
    _mysteryStatus?: string | null;
}

export default function ActivityPrintPage({ games }: ActivityPrintPageProps) {
    const [activities, setActivities] = useState<PrintableGame[]>([]);
    const [filteredPdf, setFilteredPdf] = useState<PrintableGame[]>([]);
    const [filteredPrintable, setFilteredPrintable] = useState<PrintableGame[]>([]);
    const [allThemes, setAllThemes] = useState<string[]>([]);
    const [allTypes, setAllTypes] = useState<string[]>([]);
    const [currentPriceFilter, setCurrentPriceFilter] = useState<"all" | "free" | "asc" | "desc">("all");
    const [visibleCount, setVisibleCount] = useState(8); // nombre initial
    const [mysteryActivity, setMysteryActivity] = useState<{ mysteryUntil: string } | null>(null);


    const pdfActivities = activities.filter((a) => a.pdfUrl);
    const printableActivities = activities.filter((a) => a.isPrintable);
    const shouldShowPlastifiedSection = currentPriceFilter !== "free";

    // useEffect(() => {
    //     const fetchData = async () => {
    //         const res = await fetch("/api/printable");
    //         const data = await res.json();
    //         setActivities(data);

    //         try {
    //             const mysteryRes = await fetch("/api/printable");
    //             if (mysteryRes.ok) {
    //                 const mysteryData = await mysteryRes.json();
    //                 if (mysteryData.hasMystery && !mysteryData.isRevealed) {
    //                     setMysteryActivity({ mysteryUntil: mysteryData.mysteryUntil });
    //                 }
    //             }
    //         } catch (error) {
    //             console.log("Pas d'activité mystère en cours");
    //         }
    //     };
    //     fetchData();
    // }, []);

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch("/api/printable");
            const data: PrintableGame[] = await res.json();
            setActivities(data);

            // On cherche l'activité mystère non encore révélée
            const now = Date.now();
            const pendingMystery = data.find(a =>
                a.isMystery &&
                a.mysteryUntil != null &&
                new Date(a.mysteryUntil).getTime() > now
            );
            setMysteryActivity(
                pendingMystery
                    ? { mysteryUntil: pendingMystery.mysteryUntil! }
                    : null
            );
        };
        fetchData();
    }, []);


    useEffect(() => {
        setFilteredPdf(pdfActivities);
        setFilteredPrintable(printableActivities);

        const themes = new Set<string>();
        const types = new Set<string>();

        activities.forEach((a) => {
            a.themes?.forEach((t) => themes.add(t.theme.label));
            a.types?.forEach((t) => types.add(t.type.label));
        });

        setAllThemes([...themes]);
        setAllTypes([...types]);
    }, [activities]);

    const nonMysteryActivities = filteredPdf.filter(a =>
        !(a.isMystery && a.mysteryUntil === mysteryActivity?.mysteryUntil)
    );

    const countToShow = mysteryActivity ? visibleCount - 1 : visibleCount;

    return (
        <>
            <header className="banner--bg">
                <Banner
                    className="banner--printable"
                    src="/bg/halo-jeux.png"
                    title="Activités à imprimer"
                    description="Accédez à une collection d'activités ludiques et pédagogiques, prêtes à être imprimées ! Développez les compétences de vos enfants avec des fiches éducatives, des jeux logiques et des supports plastifiés pour un apprentissage durable."
                    buttons={[
                        {
                            label: (
                                <>
                                    <Image
                                        src="/icons/activites/activitefiche.png"
                                        alt="Fiche PDF"
                                        width={20}
                                        height={20}
                                        style={{ marginRight: "8px", verticalAlign: "middle" }}
                                    />
                                    Fiches PDF
                                </>
                            ),
                            targetId: "section-pdf",
                        },
                        {
                            label: (
                                <>
                                    <Image
                                        src="/icons/activites/ficheplastifiee.png"
                                        alt="Activités plastifiées"
                                        width={20}
                                        height={20}
                                        style={{ marginRight: "8px", verticalAlign: "middle" }}
                                    />
                                    Activités plastifiées
                                </>
                            ),
                            targetId: "section-plastifiees",
                        },
                    ]}

                />
            </header>
            <main className="activites">
                <Breadcrumb
                    crumbs={[
                        { label: "Accueil", href: "/" },
                        { label: "Activités à imprimer" } // Pas de href = page actuelle
                    ]}
                />
                <section className="activites__intro">
                    <h1>Fiches pédagogiques à imprimer</h1>
                    <h2 className="highlighted">Trivium & Quadrivium</h2>
                    <p>
                        Toutes les fiches Tissatout sont conçues avec soin pour favoriser une pédagogie claire,
                        progressive et sans surcharge. Disponibles en PDF à imprimer ou en version plastifiée.
                    </p>
                    <div className="activites__badges">
                        <span className="badge">
                            <Image
                                src="/icons/activites/activitefiche.png"
                                alt="Nombre de fiches"
                                width={16}
                                height={16}
                                style={{ marginRight: "6px", verticalAlign: "middle" }}
                            />
                            {activities.length} fiches
                        </span>

                        <span className="badge">
                            <Image
                                src="/icons/activites/rapide.png"
                                alt="Rapide"
                                width={16}
                                height={16}
                                style={{ marginRight: "6px", verticalAlign: "middle" }}
                            />
                            Rapide
                        </span>

                        <span className="badge">
                            <Image
                                src="/icons/activites/activiteage.png"
                                alt="À partir de 3 ans"
                                width={16}
                                height={16}
                                style={{ marginRight: "6px", verticalAlign: "middle" }}
                            />
                            Dès 3 ans
                        </span>

                    </div>
                </section>

                <section className="activites__features">
                    <div className="feature">
                        <Image
                            src="/icons/activites/activiteaimprimer.png"
                            alt="Icône Prêtes à imprimer"
                            width={32}
                            height={32}
                            style={{ marginBottom: "8px" }}
                        />
                        <h3>Prêtes à imprimer</h3>
                        <p>Des fiches claires, lisibles, testées par des enseignants.</p>
                    </div>

                    <div className="feature">
                        <Image
                            src="/icons/activites/ficheplastifiee.png"
                            alt="Icône Version plastifiée"
                            width={32}
                            height={32}
                            style={{ marginBottom: "8px" }}
                        />
                        <h3>Version plastifiée</h3>
                        <p>Réutilisables à volonté, idéales pour les petites mains.</p>
                    </div>

                    <div className="feature">
                        <Image
                            src="/icons/activites/activitetradi.png"
                            alt="Icône Méthode classique"
                            width={32}
                            height={32}
                            style={{ marginBottom: "8px" }}
                        />
                        <h3>Méthode classique</h3>
                        <p>Inspirées du Trivium et du Quadrivium, pour structurer l’apprentissage.</p>
                    </div>

                </section>

                <section className="activites__summary">
                    <div className="activites__summary-content">
                        <div className="activites__summary-text">
                            <h3>Deux formats selon vos besoins :</h3>
                            <p>
                                <strong>PDF à imprimer</strong> pour une utilisation immédiate ou
                                <strong> fiches plastifiées</strong> pour un usage durable à l’école ou à la maison.
                            </p>
                        </div>

                        <nav className="activites__summary-nav">
                            <a href="#section-pdf" className="activites__btn">➕ Voir les PDF</a>
                            <a href="#section-plastifiees" className="activites__btn">➕ Voir les plastifiées</a>
                        </nav>
                    </div>
                </section>

                {mysteryActivity && (
                    <section className="activites__section">
                        <MysteryTeaser mysteryUntil={mysteryActivity.mysteryUntil} />
                    </section>
                )}


                <section className="activites__layout">
                    <div className="activites__list">
                        <section className="activites__section">

                            <section id="section-pdf" className="activites__section activites__filters-bar">
                                <div className="activites__header">
                                    <div className="activites__header-texte">
                                        <div className="title-with-icon">
                                            <Image
                                                src="/icons/activites/activitefiche.png"
                                                alt="Icône PDF"
                                                width={32}
                                                height={32}
                                                className="section-icon"
                                            />
                                            <h2>Activités à imprimer en PDF</h2>
                                        </div>
                                        <p>Parfait pour un usage immédiat. Téléchargez, imprimez, utilisez !</p>
                                    </div>

                                    <ActivityFilter
                                        themes={allThemes}
                                        types={allTypes}
                                        onFilterChange={({ age, selectedThemes, selectedTypes, priceFilter }) => {
                                            setCurrentPriceFilter(priceFilter);
                                            const [minAge, maxAge] = age === "all" ? [0, 99] : age.split("–").map(Number);

                                            const matches = (a: PrintableGame) => {
                                                const matchAge = a.ageMax >= minAge && a.ageMin <= maxAge;
                                                const matchThemes = selectedThemes.length === 0 || a.themes?.some((t) => selectedThemes.includes(t.theme.label));
                                                const matchTypes = selectedTypes.length === 0 || a.types?.some((t) => selectedTypes.includes(t.type.label));
                                                const matchPrice = priceFilter === "free" ? a.pdfUrl && (a.pdfPrice ?? 0) === 0 : true;
                                                return matchAge && matchThemes && matchTypes && matchPrice;
                                            };

                                            const filteredPDF = pdfActivities.filter(matches);
                                            const filteredPRINT = printableActivities.filter(matches);

                                            if (priceFilter === "asc") filteredPDF.sort((a, b) => (a.pdfPrice ?? 0) - (b.pdfPrice ?? 0));
                                            if (priceFilter === "desc") filteredPDF.sort((a, b) => (b.pdfPrice ?? 0) - (a.pdfPrice ?? 0));

                                            setFilteredPdf(filteredPDF);
                                            setFilteredPrintable(filteredPRINT);
                                        }}
                                    />
                                </div>
                            </section>
                            <div className="activites__grid">
                                {/* Afficher d'abord la carte mystère si elle existe */}
                                {mysteryActivity && (
                                    <MysteryActivityCard
                                        key="mystery-card"
                                        mysteryUntil={mysteryActivity.mysteryUntil}
                                        ageRange="À découvrir"
                                    />
                                )}

                                {/* Afficher les autres activités */}
                                {nonMysteryActivities
                                    .slice(0, countToShow)
                                    .map(a => (
                                        <ActivityCard
                                            key={a.id}
                                            id={a.id}
                                            slug={a.slug}
                                            title={a.title}
                                            ageRange={`${a.ageMin}–${a.ageMax} ans`}
                                            imageUrl={a.imageUrl}
                                            pdfUrl={a.pdfUrl}
                                            pdfPrice={a.pdfPrice}
                                            themes={a.themes?.map((t) => t.theme.label) || []}
                                            types={a.types?.map((t) => t.type.label) || []}
                                            isMystery={a.isMystery}
                                            mysteryUntil={a.mysteryUntil}
                                        />
                                    ))}
                            </div>
                            {/* 3️⃣ Bouton “Voir plus” selon le nombre réel de cartes normales restantes */}
                            {visibleCount <
                                nonMysteryActivities.filter(a =>
                                    !(a.isMystery && a.mysteryUntil === mysteryActivity?.mysteryUntil)
                                ).length && (
                                    <div className="activites__load-more" style={{ textAlign: "center", marginTop: "2rem" }}>
                                        <button
                                            onClick={() => setVisibleCount(prev => prev + 8)}
                                            className="activites__btn"
                                        >
                                            ➕ Voir plus de fiches
                                        </button>
                                    </div>
                                )}
                        </section>

                        <div className="activites__separator">
                            <span>Ou bien, optez pour la version plastifiée 👇</span>
                        </div>

                        <section id="section-plastifiees" className="activites__filters-bar">
                            <div className="activites__header-plast">
                                <div className="activites__header-texte">
                                    <div className="title-with-icon">
                                        <Image
                                            src="/icons/activites/ficheplastifiee.png"
                                            alt="Icône Version plastifiée"
                                            width={28}
                                            height={28}
                                            className="title-icon"
                                        />
                                        <h2>Activités plastifiées</h2>
                                    </div>
                                    <p>Plus solides, idéales pour durer dans le temps.</p>
                                </div>
                            </div>
                            <div className="activites__coming-soon">
                                <p>🟡 Les fiches plastifiées arrivent bientôt !</p>
                                <p className="activites__note">Encore un peu de patience… elles sont en préparation pour vous garantir la meilleure qualité possible ✨</p>
                            </div>

                        </section>

                        {/* {shouldShowPlastifiedSection && (
                            <>
                                <div className="activites__separator">
                                    <span>Ou bien, optez pour la version plastifiée 👇</span>
                                </div>

                                <section id="section-plastifiees" className="activites__filters-bar">
                                    <div className="activites__header-plast">
                                        <div className="activites__header-texte">
                                            <h2>📦 Activités plastifiées</h2>
                                            <p>Plus solides, idéales pour durer dans le temps.</p>
                                        </div>
                                        <ActivityFilter
                                            themes={allThemes}
                                            types={allTypes}
                                            onFilterChange={({ age, selectedThemes, selectedTypes, priceFilter }) => {
                                                setCurrentPriceFilter(priceFilter);
                                                const [minAge, maxAge] = age === "all" ? [0, 99] : age.split("–").map(Number);

                                                const matches = (a: PrintableGame) => {
                                                    const matchAge = a.ageMax >= minAge && a.ageMin <= maxAge;
                                                    const matchThemes = selectedThemes.length === 0 || a.themes?.some((t) => selectedThemes.includes(t.theme.label));
                                                    const matchTypes = selectedTypes.length === 0 || a.types?.some((t) => selectedTypes.includes(t.type.label));
                                                    const matchPrice = priceFilter === "free" ? a.pdfUrl && (a.pdfPrice ?? 0) === 0 : true;
                                                    return matchAge && matchThemes && matchTypes && matchPrice;
                                                };

                                                const filteredPDF = pdfActivities.filter(matches);
                                                const filteredPRINT = printableActivities.filter(matches);

                                                if (priceFilter === "asc") filteredPDF.sort((a, b) => (a.pdfPrice ?? 0) - (b.pdfPrice ?? 0));
                                                if (priceFilter === "desc") filteredPDF.sort((a, b) => (b.pdfPrice ?? 0) - (a.pdfPrice ?? 0));

                                                setFilteredPdf(filteredPDF);
                                                setFilteredPrintable(filteredPRINT);
                                            }}
                                        />
                                    </div>

                                    <div className="activites__grid">
                                        {filteredPrintable.map((a) => (
                                            <ActivityCard
                                                key={a.id}
                                                id={a.id}
                                                slug={a.slug}
                                                title={a.title}
                                                ageRange={`${a.ageMin}–${a.ageMax} ans`}
                                                imageUrl={a.imageUrl}
                                                pdfUrl={a.pdfUrl}
                                                pdfPrice={a.pdfPrice}
                                                printPrice={a.printPrice}
                                                themes={a.themes?.map((t) => t.theme.label) || []}
                                                types={a.types?.map((t) => t.type.label) || []}
                                            />
                                        ))}
                                    </div>
                                </section>

                            </>
                        )} */}
                    </div>
                </section>

                <section className="activites__seo">
                    <h2>Pourquoi choisir les fiches Tissatout ?</h2>
                    <p>
                        Chez Tissatout, chaque activité est pensée pour favoriser l'autonomie, la concentration
                        et la logique. Nos contenus s’inspirent du Trivium (Grammaire, Logique, Rhétorique) et
                        du Quadrivium (Musique, Arithmétique, Géométrie, Astronomie). C’est un retour à une
                        pédagogie simple, solide et efficace.
                    </p>
                    <p>
                        Les fiches à imprimer sont parfaites pour un usage flexible, tandis que les versions
                        plastifiées offrent une durabilité idéale pour une manipulation régulière. Que vous
                        soyez parent, enseignant ou accompagnant, nos fiches vous aideront à transmettre avec
                        rigueur et douceur.
                    </p>
                </section>
                <BackToTop />
            </main>
        </>
    );
}
