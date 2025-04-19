"use client";

import { useEffect, useState } from "react";
import Banner from "@/components/Banner/Banner";
import ActivityCard from "./ActivityCard";

interface PrintableGame {
    id: string;
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
}

export default function ActivityPrintPage() {
    const [activities, setActivities] = useState<PrintableGame[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch("/api/printable");
            const data = await res.json();
            setActivities(data);
        };
        fetchData();
    }, []);

    const pdfActivities = activities.filter((a) => a.pdfUrl);
    const printableActivities = activities.filter((a) => a.isPrintable);

    return (
        <>
            <Banner
                src="/images/banners/printable.jpg"
                title="Activités à imprimer – Trivium & Quadrivium"
                description="Téléchargez des fiches éducatives ou recevez-les plastifiées. Des outils concrets pour apprendre avec méthode, dès 3 ans."
                buttons={[
                    { label: "📄 Fiches PDF", targetId: "section-pdf" },
                    { label: "🧵 Activités plastifiées", targetId: "section-plastifiees" },
                ]}
            />

            <main className="activites">
                {/* INTRODUCTION */}
                <section className="activites__intro">
                    <h1>Fiches pédagogiques à imprimer</h1>
                    <h2 className="highlighted">Trivium & Quadrivium</h2>
                    <p>
                        Toutes les fiches Tissatout sont conçues avec soin pour favoriser une
                        pédagogie claire, progressive et sans surcharge. Disponibles en PDF à imprimer
                        ou en version plastifiée.
                    </p>

                    <div className="activites__badges">
                        <span className="badge">📅 {activities.length} fiches</span>
                        <span className="badge">📦 Rapide</span>
                        <span className="badge">🎓 Dès 3 ans</span>
                    </div>
                </section>

                {/* AVANTAGES */}
                <section className="activites__features">
                    <div className="feature">
                        <i>📄</i>
                        <h3>Prêtes à imprimer</h3>
                        <p>Des fiches claires, lisibles, testées par des enseignants.</p>
                    </div>
                    <div className="feature">
                        <i>📦</i>
                        <h3>Version plastifiée</h3>
                        <p>Réutilisables à volonté, idéales pour les petites mains.</p>
                    </div>
                    <div className="feature">
                        <i>📚</i>
                        <h3>Méthode classique</h3>
                        <p>Inspirées du Trivium et du Quadrivium, pour structurer l’apprentissage.</p>
                    </div>
                </section>

                {/* NAVIGATION */}
                <nav className="activites__nav">
                    <a href="#section-pdf" className="activites__btn">📅 Activités en PDF</a>
                    <a href="#section-plastifiees" className="activites__btn">📦 Activités plastifiées</a>
                </nav>

                {/* SECTION PDF */}
                <section id="section-pdf" className="activites__section">
                    <h2>📄 Activités à imprimer en PDF</h2>
                    <p>Idéal pour les familles en IEF ou les enseignants qui veulent imprimer à la demande.</p>

                    <div className="activites__grid">
                        {pdfActivities.map((a) => (
                            <ActivityCard
                                key={a.id}
                                id={a.id}
                                title={a.title}
                                ageRange={`${a.ageMin}–${a.ageMax} ans`}
                                imageUrl={a.imageUrl}
                                pdfUrl={a.pdfUrl}
                                pdfPrice={a.pdfPrice}
                                showPDFButton={true}
                                showPrintButton={false}
                                themes={a.themes?.map((t) => t.theme.label) || []}
                                types={a.types?.map((t) => t.type.label) || []}
                            />
                        ))}
                    </div>
                </section>

                {/* SECTION PLASTIFIÉES */}
                <section id="section-plastifiees" className="activites__section">
                    <h2>📦 Activités plastifiées</h2>
                    <p>Pour un usage durable, en classe ou à la maison. Lavables et solides.</p>

                    <div className="activites__grid">
                        {printableActivities.map((a) => (
                            <ActivityCard
                                key={a.id}
                                id={a.id}
                                title={a.title}
                                ageRange={`${a.ageMin}–${a.ageMax} ans`}
                                imageUrl={a.imageUrl}
                                pdfUrl={a.pdfUrl}
                                pdfPrice={a.pdfPrice}
                                printPrice={a.printPrice}
                                isPrintable={a.isPrintable}
                                showPDFButton={false}
                                showPrintButton={true}
                                themes={a.themes?.map((t) => t.theme.label) || []}
                                types={a.types?.map((t) => t.type.label) || []}
                            />
                        ))}
                    </div>
                </section>

                {/* SEO TEXT */}
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
            </main>
        </>
    );
}