"use client"; // Active les React Client Components

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Card from "@/components/Card/Card";
import ThemeProvider, { useTheme } from "@/components/Decorations/Themes/ThemeProvider";
import Overview from "@/layout/Overview/Overview";
import ArticleCard from "@/components/ArticleCard/ArticleCard";
import Subscribe from "@/layout/Subscribe/Subscribe";
import { news, ideas } from "@/data/home";
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


export default function HomePage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  const articlesPerPage = 3; // Nombre d'articles par slide
  const totalSlides = Math.ceil(articles.length / articlesPerPage);

  useEffect(() => {
    // Récupération des articles via l'API
    fetch("/api/articles")
      .then((res) => res.json())
      .then((data) => setArticles(data))
      .catch((err) => console.error("Erreur lors de la récupération des articles :", err));
  }, []);


  // Gestion des actualités : Suivant
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev < totalSlides - 1 ? prev + 1 : 0));
  };

  // Gestion des actualités : Précédent
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev > 0 ? prev - 1 : totalSlides - 1));
  };


  return (
    <>

      <Slideshow images={slides} />
      <ThemeProvider>
        <Overview />
      </ThemeProvider>
      {/* Section des actualités */}
      <section className="container__news">
        <h2>Nouveautés</h2>
        <div className="news-content">
          <div className="news-content__images-gallery">
            <div className="news-content__images-gallery__slide-container">
              <div className="news-content__images-gallery__slide-wrapper">
                {Array.isArray(articles) ? (
                  articles
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
              />
            </div>
          </div>
          <div className="news-content__articles-gallery">
            {Array.isArray(articles) ? (
              articles.slice(0, 5).map((article) => (
                <Link href={`/news/${article.id}`} key={article.id}>
                  <ArticleCard
                    iconSrc={article.iconSrc || ""}
                    title={article.title}
                    description={article.description || "Description non disponible"}
                    date={article.date || ""}
                  />
                </Link>
              ))
            ) : (
              <p>Aucun article disponible.</p>
            )}
          </div>
        </div>
      </section>

      {/* Section des idées */}
      <section className="container__ideas">
        <h2>Idées</h2>
        <div className="ideas-content">
          <div className="ideas-content__card">
            {ideas.map((idea, index) => (
              <Link
                href={`/news/${idea.id}`}
                key={idea.id}
                className={`ideas-content__card__link ${index === 0 || index === 3 ? "large" : "small"
                  }`}
              >
                <Card
                  cover={idea.image}
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
