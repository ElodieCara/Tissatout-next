// ContentList.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import { reverseThemeMapping } from "@/lib/themeMapping";
import NewsletterBanner from "../NewsletterBanner/NewsletterBanner";
import SuggestionsForParents from "../SuggestionsForParents/SuggestionsForParents";
import { getRandomSuggestions } from "@/lib/suggestions";

export interface ContentItem {
    id: string;
    title: string;
    slug: string;
    type: string;
    module?: "trivium" | "quadrivium";
    age?: string;
    date?: string | null;
    iconSrc?: string | null;
    imageUrl?: string | null;
    image: string | null;
    description?: string | null;
    tagLabel?: string | null;
}

interface ContentListProps {
    items: ContentItem[];
    type: string;
    title?: string;
    age?: string;
    suggestions: ContentItem[];
}

export default function ContentList({ items, type, title, age, suggestions }: ContentListProps) {
    console.log("items reçus par ContentList :", items);
    const [visibleCount, setVisibleCount] = useState(6);
    const displayed = items.slice(0, visibleCount);


    const titleMap: Record<string, string> = {
        articles: "Articles",
        conseils: "Conseils",
        idees: "Idées créatives",
        trivium: "Activités Trivium",
        quadrivium: "Activités Quadrivium",
    };

    const subtitleMap: Record<string, string> = {
        articles: "Des lectures pour éveiller la réflexion, nourrir la curiosité et grandir avec douceur.",
        conseils: "Des pistes concrètes pour accompagner les enfants dans leurs émotions, leurs besoins et leurs découvertes.",
        idees: "Des idées créatives, simples et enrichissantes pour partager des moments joyeux et constructifs.",
        trivium: "Une première approche de la grammaire, de la logique et de l’expression, adaptée à leur monde.",
        quadrivium: "Musique, mathématiques, astronomie et géométrie pour petits explorateurs de la beauté du monde.",
    };

    const seoTextMap: Record<string, string> = {
        articles: `Retrouvez ici nos meilleurs articles pour les enfants de {age}. Pensés pour éveiller, rassurer et faire grandir, chaque article vous propose des pistes éducatives douces et adaptées.`,
        conseils: `Des conseils bienveillants et concrets pour accompagner les enfants de {age} dans leur quotidien, leurs émotions, leurs découvertes.`,
        idees: `Des idées d’activités simples, jolies et éducatives à faire avec les enfants de {age}. De quoi semer l’imaginaire et la joie.`,
        trivium: `Initiez les enfants de {age} à la grammaire, à la logique et à la parole vraie avec des activités inspirées du Trivium.`,
        quadrivium: `Le Quadrivium à portée d’enfant : maths, musique, astronomie, géométrie… pour les curieux de {age} qui aiment comprendre le monde.`,
    };

    const crumbs = [
        { label: "Accueil", href: "/" },
        { label: "Âges", href: "/nos-univers" },
        { label: titleMap[type] || "Contenus" }
    ];


    return (
        <section className="content-list">
            <Breadcrumb crumbs={crumbs} />

            <div className="content-list__header">
                <h2 className="content-list__title">
                    {(title || titleMap[type] || "Contenus") + (age ? ` pour les ${age}` : "")}
                </h2>
                <p className="content-list__subtitle">{subtitleMap[type]}</p>
            </div>

            <div className="content-list__main">
                <div className="content-list__grid">
                    {displayed.map((item) => (
                        <Link
                            href={`/${item.module ?? item.type}/${item.slug}`}
                            key={item.id}
                            className="content-list__card"
                        >

                            {item.image && (
                                <div className="content-list__image-wrapper">
                                    <Image
                                        src={item.image}
                                        alt={item.title}
                                        width={300}
                                        height={200}
                                        className="content-list__image"
                                    />
                                </div>
                            )}
                            <div className="content-list__info">
                                {item.date && new Date(item.date).getTime() > Date.now() - 10 * 24 * 60 * 60 * 1000 && (
                                    <span className="content-list__badge">Nouveau</span>
                                )}
                                {item.tagLabel && reverseThemeMapping[item.tagLabel] && (
                                    <span className={`content-list__tag content-list__tag--${item.tagLabel}`}>
                                        #{reverseThemeMapping[item.tagLabel]}
                                    </span>
                                )}
                                <h3 className="content-list__card-title">{item.title}</h3>
                                {item.date && (
                                    <p className="content-list__date">
                                        {new Date(item.date).toLocaleDateString("fr-FR", {
                                            day: "2-digit",
                                            month: "long",
                                            year: "numeric",
                                        })}
                                    </p>
                                )}
                                <p className="content-list__description">
                                    {item.description ?? "Pas de description disponible."}
                                </p>
                            </div>
                            <div className="content-list__arrow">
                                <span className="arrow-icon">➔</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {items.length > visibleCount && (
                <div className="content-list__footer">
                    <button
                        onClick={() => setVisibleCount((prev) => prev + 6)}
                        className="content-list__button"
                    >
                        ➕ Voir plus
                    </button>
                </div>
            )}

            {seoTextMap[type] && age && (
                <div className="content-list__bottom-seo">
                    <Image
                        src="/icons/soleil.png"
                        alt="icone soleil"
                        width={32}
                        height={32}
                        className="content-list__image" />

                    <p>{seoTextMap[type].replace("{age}", age.toLowerCase())}</p>
                </div>
            )}

            <NewsletterBanner />
            <div className="suggestions">
                <SuggestionsForParents items={suggestions} />
            </div>


        </section>
    );
}
