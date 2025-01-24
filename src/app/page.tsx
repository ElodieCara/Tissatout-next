"use client"; // Active les React Client Components

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Card from "@/components/Card/Card";
import ThemeProvider from "@/themes/ThemeProvider";
import Overview from "@/layout/Overview/Overview";
import ArticleCard from "@/components/ArticleCard/ArticleCard";
import Subscribe from "@/layout/Subscribe/Subscribe";
import Footer from "@/layout/Footer/Footer";
import { news, ideas } from "@/data/home";
import arrowPrev from "@/assets/arrow-circle-right.png";
import arrowNext from "@/assets/arrow-circle-left.png";
import Slideshow from "@/components/Slideshow/Slideshow";
import { slide as slides } from "../data/home";

export default function HomePage() {
  const [articles, setArticles] = useState(news);
  const [currentSlide, setCurrentSlide] = useState(0);

  const articlesPerPage = 3; // Nombre d'articles par slide
  const totalSlides = Math.ceil(articles.length / articlesPerPage);

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
      <ThemeProvider />
      {/* Section des actualités */}
      <section className="container__news">
        <h2>Actualités</h2>
        <div className="news-content">
          <div className="news-content__images-gallery">
            <div className="news-content__images-gallery__slide-container">
              <div className="news-content__images-gallery__slide-wrapper">
                {articles
                  .slice(
                    currentSlide * articlesPerPage,
                    (currentSlide + 1) * articlesPerPage
                  )
                  .map((article) => (
                    <Link href={`/news/${article.id}`} key={article.id}>
                      <Card
                        cover={article.image}
                        title={article.title}
                        content={article.description}
                        type="large"
                      />
                    </Link>
                  ))}
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
            {articles.slice(3).map((article) => (
              <Link href={`/news/${article.id}`} key={article.id}>
                <ArticleCard
                  iconSrc={article.iconSrc || ""}
                  title={article.title}
                  description={article.description}
                  date={article.date || ""}
                />
              </Link>
            ))}
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
      <Footer />
    </>
  );
}
