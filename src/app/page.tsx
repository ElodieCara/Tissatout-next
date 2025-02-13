"use client"; // Active les React Client Components

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Card from "@/components/Card/Card";
import ThemeProvider, { useTheme } from "@/components/Decorations/Themes/ThemeProvider";
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
  theme: string; // Ajoute cette ligne
}

export default function HomePage() {
  return (
    <ThemeProvider>
      <HomeContent />
    </ThemeProvider>
  );
}

// 🟢 Ce composant est maintenant **dans** ThemeProvider
function HomeContent() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [recentArticlesByCategory, setRecentArticlesByCategory] = useState<Article[]>([]);
  const { theme } = useTheme(); // Thème actif
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [ideasError, setIdeasError] = useState<string | null>(null);
  const articlesPerPage = 3; // Nombre d'articles par slide
  const totalSlides = Math.ceil(articles.length / articlesPerPage);

  const themeMapping: Record<string, string> = {
    "Hiver": "winter",
    "Printemps": "spring",
    "Été": "summer",
    "Automne": "autumn",
    "Halloween": "halloween",
    "Noël": "christmas"
  };


  useEffect(() => {
    // 🟢 Récupérer les articles depuis l'API
    fetch("/api/articles")
      .then((res) => res.json())
      .then((data) => {
        setArticles(data);
        const filteredArticles = getMostRecentArticlesByCategory(data);
        setRecentArticlesByCategory(filteredArticles);
      })
      .catch((err) => console.error("Erreur lors de la récupération des articles :", err));
  }, []);

  // 🔵 Récupérer les idées en fonction du **thème actif**
  useEffect(() => {
    if (!theme) {
      console.log("❌ Aucun thème détecté !");
      return;
    }

    const normalizedTheme = theme.replace("-theme", "");
    console.log("🔍 Thème actif avant requête API :", theme);

    fetch(`/api/ideas?theme=${encodeURIComponent(normalizedTheme)}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("📤 Idées reçues :", data);
        setIdeas(data);
      })
      .catch((err) => console.error("❌ Erreur lors de la récupération des idées :", err));
  }, [theme]);

  // Fonction pour récupérer l'article le plus récent par catégorie
  const getMostRecentArticlesByCategory = (articles: Article[]) => {
    const groupedByCategory: { [key: string]: Article[] } = {};

    // Regrouper les articles par catégorie
    articles.forEach((article) => {
      if (article.category) {
        if (!groupedByCategory[article.category]) {
          groupedByCategory[article.category] = [];
        }
        groupedByCategory[article.category].push(article);
      }
    });

    // Récupérer l'article le plus récent pour chaque catégorie
    return Object.values(groupedByCategory).map((categoryArticles) => {
      return categoryArticles.sort((a, b) => new Date(b.date!).getTime() - new Date(a.date!).getTime())[0];
    });
  };

  useEffect(() => {
    setTimeout(() => {
      document.documentElement.style.setProperty("--page-height", `${document.body.scrollHeight}px`);
    }, 500);
  }, [articles]);

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

      <Overview />

      {/* 🟢 Section des actualités */}
      <section className="container__news">
        <h2>Nouveautés</h2>
        <div className="news-content">
          <div className="news-content__images-gallery">
            <div className="news-content__images-gallery__slide-container">
              <div className="news-content__images-gallery__slide-wrapper">
                {Array.isArray(articles) ? (
                  [...articles]
                    .filter((article) => article.date) // Ne garde que les articles avec une date
                    .sort((a: Article, b: Article) =>
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
            {recentArticlesByCategory.length > 0 ? (
              recentArticlesByCategory.map((article) => {
                const formattedDate = article.date
                  ? new Date(article.date).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                  : "Date inconnue";

                return (
                  <Link href={`/news/${article.id}`} key={article.id}>
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

      {/* 🔵 Section des idées (filtrées par thème actif) */}
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
