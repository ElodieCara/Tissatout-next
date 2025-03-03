"use client";

import Link from "next/link";
import Image from "next/image";
import { sections } from "@/data/home"; // Importe tes tranches d’âge
import { activities } from "@/data/home";
import { useState } from "react";
import Head from "next/head";
import Banner from "@/components/Banner/Banner";
import Button from "@/components/Button/Button";
import { Tag } from "@/types/home";
import FloatingIcons from "@/components/FloatingIcon/FloatingIcons";
import RubanTrivium from "@/components/Ruban/Ruban";
import BackToTop from "@/components/BackToTop/BackToTop";

const categories = ["grammaire", "logique", "rhetorique", "motricite"];

export default function Home() {
    const [selectedCategory, setSelectedCategory] = useState<"grammaire" | "logique" | "rhetorique" | "motricite">("grammaire");

    return (
        <>
            <Head>
                <title>Nos Univers ✨</title>
                <meta name="description" content="Découvrez des activités adaptées à chaque âge !" />
            </Head>

            <header className="nos-univers">
                <Banner
                    src="/assets/slide3.png"
                    title="Explorez Nos Univers ✨"
                    description="Découvrez des activités adaptées à chaque âge pour stimuler la créativité, l’éveil et l’apprentissage des enfants. Trouvez des idées originales pour apprendre en s’amusant !"
                    buttons={[
                        { label: "🌟 Par Âge", targetId: "univers" },
                        { label: "🎓 Trivium", targetId: "trivium" },
                        { label: "🎭 Centres d’Intérêt", targetId: "interets" }
                    ]}
                />
            </header>

            <div className="nos-univers__categories">
                <FloatingIcons />
                {/* ✅ Ajout du bouton BackToTop */}
                <BackToTop />
                <h2 className="nos-univers__categories-title">🌱 Les univers par âge</h2>
                <section id="univers" className="nos-univers__categories-wrapper">
                    {sections.map((section, index) => (
                        <div key={section.title} className="nos-univers__categories__card">
                            <Link href={`/nos-univers/${encodeURIComponent(section.title)}`} className="nos-univers__categories__card-link">
                                {/* ✅ Vérification avant d'afficher les tags */}
                                {section.tags && (
                                    <div className="nos-univers__categories__card__tags">
                                        {section.tags.map((tag: Tag, i: number) => (
                                            <span key={i} className={`tag tag--${tag.color}`}>
                                                {tag.label}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                <div className="nos-univers__categories__card__image">
                                    <Image src={section.imageCard} alt={section.title} width={160} height={160} />
                                </div>
                                <div className="nos-univers__categories__card__content">
                                    <h2 className="nos-univers__categories__card__title">{section.title}</h2>
                                    <p>{section.content}</p>
                                    <p>{section.conclusion}</p>
                                    <Button className="small">Explorer cet univers</Button>
                                </div>
                            </Link>

                            {/* ✅ Ajoute la peluche sous le premier cadre seulement */}
                            {index === 0 && <div className="nos-univers__categories__squished-plush">🧸</div>}
                        </div>
                    ))}
                </section>

                {/* ACTIVITÉS TRIVIUM */}
                <section id="trivium" className="nos-univers__trivium">
                    <h2 className="nos-univers__trivium-title">📖 Des activités selon le Trivium </h2>
                    <RubanTrivium />
                </section>

                {/* ACTIVITÉS THEMATIQUE */}
                <section id="interets" className="nos-univers__activites">
                    <h2>🎯 Des activités par thématique</h2>

                    {/* ✅ Introduction sur le Trivium */}
                    <p className="nos-univers__activites-intro">
                        Découvrez des activités ludiques et éducatives classées par thématiques pour apprendre, créer et s’amuser à tout âge ! 🚀✨
                    </p>

                    {/* ✅ Filtre de sélection */}
                    <div className="nos-univers__activites-filter">
                        {["grammaire", "logique", "rhetorique", "motricite"].map((category) => (
                            <Button
                                key={category}
                                className={`filter-button ${selectedCategory === category ? "active" : ""}`}
                                onClick={() => setSelectedCategory(category as "grammaire" | "logique" | "rhetorique" | "motricite")}
                            >
                                {category.charAt(0).toUpperCase() + category.slice(1)}
                            </Button>
                        ))}
                    </div>

                    {/* ✅ Affichage dynamique des activités selon la sélection */}
                    <div className="nos-univers__activites-grid">
                        {activities[selectedCategory].map((activity) => (
                            <Link key={activity.title} href={activity.link} className="nos-univers__activites__card">
                                <Image
                                    src={activity.icon}
                                    alt={activity.title}
                                    width={150}
                                    height={150}
                                    className="activity-icon"
                                    loading="lazy"

                                />
                                <p>{activity.title}</p>
                            </Link>
                        ))}
                    </div>
                </section>






                {/* <section className="nos-univers__conseils">
                    <div className="nos-univers__conseils__container">
                        <div className="nos-univers__conseils__image">
                            <img src="/assets/conseils-motricite.jpg" alt="Conseils sur la motricité fine" />
                        </div>
                        <div className="nos-univers__conseils__content">
                            <h2>Des conseils adaptés à chaque étape du développement !</h2>
                            <p>Pourquoi la motricité fine est-elle essentielle au développement des enfants ? Découvrez comment stimuler leur autonomie et leur créativité avec des activités adaptées.</p>
                            <a href="/conseils" className="btn">Lire les conseils</a>
                        </div>
                    </div>
                </section> */}

            </div>


        </>
    );
}
