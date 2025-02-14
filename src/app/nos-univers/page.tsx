"use client";

import Link from "next/link";
import Image from "next/image";
import { sections } from "@/data/home"; // Importe tes tranches d’âge
import Head from "next/head";
import Banner from "@/components/Banner/Banner";
import Button from "@/components/Button/Button";
import { Tag } from "@/types/home";
import FloatingIcons from "@/components/FloatingIcon/FloatingIcons";


export default function Home() {
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
                    description="Des activités et inspirations adaptées à chaque âge !"
                />
            </header>

            <div className="nos-univers__categories-wrapper">
                <FloatingIcons />
                <section className="nos-univers__categories">
                    {sections.map((section, index) => (
                        <div key={section.title} className="category-card-container">
                            <Link href={`/nos-univers/${encodeURIComponent(section.title)}`} className="category-card">
                                {/* ✅ Vérification avant d'afficher les tags */}
                                {section.tags && (
                                    <div className="category-card__tags">
                                        {section.tags.map((tag: Tag, i: number) => (
                                            <span key={i} className={`tag tag--${tag.color}`}>
                                                {tag.label}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                <div className="category-card__image">
                                    <Image src={section.imageCard} alt={section.title} width={160} height={160} />
                                </div>
                                <div className="category-card__content">
                                    <h2 className="category-card__content__title">{section.title}</h2>
                                    <p>{section.content}</p>
                                    <p>{section.conclusion}</p>
                                    <Button className="small">Explorer cet univers</Button>
                                </div>
                            </Link>

                            {/* ✅ Ajoute la peluche sous le premier cadre seulement */}
                            {index === 0 && <div className="squished-plush">🧸</div>}
                        </div>
                    ))}
                </section>

            </div>


        </>
    );
}
