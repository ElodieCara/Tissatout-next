"use client";

import Link from "next/link";
import Image from "next/image";
import { sections } from "@/data/home"; // Importe tes tranches d’âge
import Head from "next/head";
import Banner from "@/components/Banner/Banner";
import Button from "@/components/Button/Button";

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
                <section className="nos-univers__categories">
                    {sections.map((section) => (
                        <Link key={section.title} href={`/nos-univers/${encodeURIComponent(section.title)}`} className="category-card" aria-label={`Explorer l'univers ${section.title}`}>
                            <div className="category-card__image">
                                <Image src={section.imageCard.src} alt={section.title} width={250} height={180} />
                            </div>
                            <h2 className="category-card__title">{section.title}</h2>
                            <p>{section.content}</p>
                            <div className="explorer-button" aria-label={`Explorer les activités pour ${section.title}`}>
                                Explorer
                            </div>
                        </Link>
                    ))}
                </section>
            </div>

        </>
    );
}
