"use client"; // Active le mode Client Component

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Card from "@/components/Card/Card";
import { useTheme } from "@/components/Decorations/Themes/ThemeProvider";
import Overview from "@/layout/Overview/Overview";
import ArticleCard from "@/components/ArticleCard/ArticleCard";
import Subscribe from "@/layout/Subscribe/Subscribe";
import arrowPrev from "@/assets/arrow-circle-right.png";
import arrowNext from "@/assets/arrow-circle-left.png";
import Slideshow from "@/components/Slideshow/Slideshow";
import { slide as slides } from "../data/home";

interface Article {
    id: string;
    title: string;
    content: string;
    image?: string;
    description?: string;
    tags?: string[];
    category?: string;
    date?: string;
    iconSrc?: string;
}

interface Idea {
    id: string;
    title: string;
    description: string;
    image?: string;
    theme: string;
}

// ✅ Fonction pour récupérer l'article le plus récent par catégorie
const getMostRecentArticlesByCategory = (articles: Article[]) => {
    const groupedByCategory: { [key: string]: Article[] } = {};

    articles.forEach((article) => {
        if (article.category) {
            if (!groupedByCategory[article.category]) {
                groupedByCategory[article.category] = [];
            }
            groupedByCategory[article.category].push(article);
        }
    });

    // ✅ Récupérer **le plus récent** pour chaque catégorie
    return Object.values(groupedByCategory).map((categoryArticles) =>
        categoryArticles.sort((a, b) => new Date(b.date!).getTime() - new Date(a.date!).getTime())[0]
    );
};

export default function HomeContent({ articles }: { articles: Article[] }) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [recentArticlesByCategory, setRecentArticlesByCategory] = useState<Article[]>([]);
    const { theme } = useTheme(); // Thème actif
    const [ideas, setIdeas] = useState<Idea[]>([]);
    const [ideasError, setIdeasError] = useState<string | null>(null);
    const articlesPerPage = 3;
    const totalSlides = Math.ceil(articles.length / articlesPerPage);

    // 🟢 Mise à jour des articles récents
    useEffect(() => {
        if (articles.length > 0) {
            const filteredArticles = getMostRecentArticlesByCategory(articles);
            setRecentArticlesByCategory(filteredArticles);
        }
    }, [articles]);

    // 🔵 Récupérer les idées en fonction du thème actif
    useEffect(() => {
        if (!theme) return;
        const normalizedTheme = theme.replace("-theme", "");

        fetch(`/api/ideas?theme=${encodeURIComponent(normalizedTheme)}`)
            .then((res) => res.json())
            .then((data) => setIdeas(data))
            .catch((err) => console.error("Erreur lors de la récupération des idées :", err));
    }, [theme]);

    useEffect(() => {
        setTimeout(() => {
            document.documentElement.style.setProperty("--page-height", `${document.body.scrollHeight}px`);
        }, 500);
    }, [JSON.stringify(articles), theme]);

    const nextSlide = () => setCurrentSlide((prev) => (prev < totalSlides - 1 ? prev + 1 : 0));
    const prevSlide = () => setCurrentSlide((prev) => (prev > 0 ? prev - 1 : totalSlides - 1));

    return (
        <>
            <Slideshow images={slides} />
            <Overview />

            {/* 🟢 Section des actualités */}
            <section className="container__news">
                <h2>Nouveautés</h2>
                <div className="news-content">
                    <div className="news-content__images-gallery">
                        <div className="news-content__images-gallery__slide-container">
                            <div className="news-content__images-gallery__slide-wrapper">
                                {articles.length > 0 ? (
                                    [...articles]
                                        .filter((article) => article.date)
                                        .sort((a, b) =>
                                            new Date(b.date!).getTime() - new Date(a.date!).getTime()
                                        )
                                        .slice(
                                            currentSlide * articlesPerPage,
                                            (currentSlide + 1) * articlesPerPage
                                        )
                                        .map((article) => (
                                            <Link href={`/news/${article.id}`} key={article.id}>
                                                <Card
                                                    cover={article.image || "/default-image.png"}
                                                    title={article.title}
                                                    category={article.category}
                                                    tags={article.tags || []}
                                                    content={article.description || article.content.substring(0, 100)}
                                                    type="large"
                                                />
                                            </Link>
                                        ))
                                ) : (
                                    <p>Aucun article disponible.</p>
                                )}
                            </div>
                        </div>
                        <div className="news-content__images-gallery__controls">
                            <Image
                                className="arrow-prev"
                                src={arrowPrev}
                                alt="Précédent"
                                width={50}
                                height={50}
                                onClick={prevSlide}
                                priority={true}
                                sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                            <div className="news-content__images-gallery__slide-pagination">
                                {Array.from({ length: totalSlides }).map((_, idx) => (
                                    <span
                                        key={idx}
                                        className={`dot ${idx === currentSlide ? "active" : ""}`}
                                        onClick={() => setCurrentSlide(idx)}
                                    />
                                ))}
                            </div>
                            <Image
                                className="arrow-next"
                                src={arrowNext}
                                alt="Suivant"
                                width={50}
                                height={50}
                                onClick={nextSlide}
                                priority={true}
                                sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                        </div>
                    </div>

                    {/* 🔵 Articles par catégorie */}
                    <div className="news-content__articles-gallery">
                        {recentArticlesByCategory.length > 0 ? (
                            recentArticlesByCategory.map((article) => {
                                const formattedDate = article.date
                                    ? new Date(article.date!).toLocaleDateString("fr-FR", {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                    })
                                    : "Date inconnue";

                                return (
                                    <Link href={`/news/${article.id}`} key={article.id} className="news-content__articles-card">
                                        <ArticleCard
                                            iconSrc={article.iconSrc || ""}
                                            title={article.title}
                                            description={
                                                article.description
                                                    ? article.description.length > 100
                                                        ? article.description.substring(0, 250) + "..."
                                                        : article.description
                                                    : "Description non disponible"
                                            }
                                            date={formattedDate}
                                        />
                                    </Link>
                                );
                            })
                        ) : (
                            <p>Aucun article disponible.</p>
                        )}
                    </div>
                </div>
            </section>

            {/* 🔵 Section des idées */}
            <section className="container__ideas">
                <h2>Idées</h2>
                {ideasError ? <p className="error">{ideasError}</p> : null}
                <div className="ideas-content">
                    <div className="ideas-content__card">
                        {ideas.slice(0, 4).map((idea, index) => (
                            <Link
                                href={`/ideas/${idea.id}`}
                                key={idea.id}
                                className={`ideas-content__card__link ${index === 0 || index === 3 ? "large" : "small"}`}
                            >
                                <Card
                                    cover={idea.image || ""}
                                    title={idea.title}
                                    content={idea.description}
                                    type={index === 0 || index === 3 ? "large" : "small"}
                                />
                            </Link>
                        ))}
                    </div>
                </div>
            </section>


            <Subscribe />
        </>
    );
}
