"use client";

import Link from "next/link";
import Image from "next/image";
import { activities } from "@/data/home";
import { useEffect, useState } from "react";
import Head from "next/head";
import Banner from "@/components/Banner/Banner";
import Button from "@/components/Button/Button";
import { Tag } from "@/types/home";
import FloatingIcons from "@/components/FloatingIcon/FloatingIcons";
import RubanTrivium from "@/components/Ruban/Ruban";
import BackToTop from "@/components/BackToTop/BackToTop";

const categories = ["grammaire", "logique", "rhetorique", "motricite"];

export default function NosUnivers({ settings }: { settings: any }) {
    const [selectedCategory, setSelectedCategory] = useState<"grammaire" | "logique" | "rhetorique" | "motricite">("grammaire");
    const [ageCategories, setAgeCategories] = useState<any[]>([]);

    useEffect(() => {
        fetch("/api/ageCategory")
            .then((res) => res.json())
            .then((data) => {
                setAgeCategories(data);
            });
    }, []);

    return (
        <>
            <Head>
                <title>Nos Univers ✨</title>
                <meta name="description" content="Découvrez des activités adaptées à chaque âge !" />
            </Head>

            <header className="nos-univers">
                <Banner
                    src={settings?.universBanner || "/assets/slide3.png"}
                    title={settings?.universTitle || "Explorez Nos Univers ✨"}
                    description={
                        settings?.universDesc ||
                        "Découvrez des activités adaptées à chaque âge pour stimuler la créativité, l’éveil et l’apprentissage des enfants. Trouvez des idées originales pour apprendre en s’amusant !"
                    }
                    buttons={[
                        { label: "🌟 Par Âge", targetId: "univers" },
                        { label: "🎓 Trivium", targetId: "trivium" },
                        { label: "🎭 Centres d’Intérêt", targetId: "interets" },
                    ]}
                />
            </header>

            <div className="nos-univers__categories">
                <FloatingIcons />
                <BackToTop />

                <h2 className="nos-univers__categories-title">🌱 Les univers par âge</h2>

                <section id="univers" className="nos-univers__categories-wrapper">
                    {ageCategories.map((section, index) => (
                        <div key={section.title} className="nos-univers__categories__card">
                            <Link href={`/nos-univers/${section.slug}`} className="nos-univers__categories__card-link">
                                {section.tags && Array.isArray(section.tags) && section.tags.length > 0 && (
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

                            {index === 0 && <div className="nos-univers__categories__squished-plush" />}
                        </div>
                    ))}
                </section>

                {/* ACTIVITÉS TRIVIUM */}
                <section id="trivium" className="nos-univers__trivium">
                    <h2 className="nos-univers__trivium-title">📖 Des activités selon le Trivium </h2>
                    <RubanTrivium />
                </section>

                {/* ACTIVITÉS THÉMATIQUES */}
                <section id="interets" className="nos-univers__activites">
                    <h2>🎯 Des activités par thématique</h2>
                    <p className="nos-univers__activites-intro">
                        Découvrez des activités ludiques et éducatives classées par thématiques pour apprendre, créer et s’amuser à tout âge ! 🚀✨
                    </p>

                    <div className="nos-univers__activites-filter">
                        {categories.map((category) => (
                            <Button
                                key={category}
                                className={`filter-button ${selectedCategory === category ? "active" : ""}`}
                                onClick={() => setSelectedCategory(category as any)}
                            >
                                {category.charAt(0).toUpperCase() + category.slice(1)}
                            </Button>
                        ))}
                    </div>

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
            </div>
        </>
    );
}
