"use client";
import { useState, useEffect } from "react";
import Card from "@/components/Card/Card";
import Button from "@/components/Button/Button";

interface Article {
    id: string;
    title: string;
    description: string;
    image?: string;
    date?: string;
    category?: string;
    tags?: string[];
    iconSrc?: string;
}

// Fonction pour formater la date en "JJ-MM-YY"
const formatDate = (dateString?: string) => {
    if (!dateString) return "Date inconnue";
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString().slice(-2);
    return `${day}-${month}-${year}`;
};

export default function InspirationArticles() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [visibleArticles, setVisibleArticles] = useState(10);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetch("/api/articles")
            .then((res) => res.json())
            .then((data: Article[]) => setArticles(data))
            .catch((err) => console.error("❌ Erreur lors de la récupération des articles :", err));
    }, []);

    const loadMoreArticles = () => {
        setIsLoading(true);
        setTimeout(() => {
            setVisibleArticles((prev) => prev + 10);
            setIsLoading(false);
        }, 1500);
    };

    return (
        <section className="container__news">
            <h2>🌟 Tous les articles</h2>
            <div className="inspiration__content__newsGrid">
                {articles.length > 0 ? (
                    articles.slice(0, visibleArticles).map((article) => (
                        <Card
                            key={article.id}
                            cover={article.image || "/default-image.png"}
                            title={article.title}
                            date={formatDate(article.date)}
                            category={article.category}
                            tags={article.tags || []}
                            iconSrc={article.iconSrc || ""}
                            content={article.description || article.description?.substring(0, 100) + "..."}
                            type="large"
                            buttonColor="yellow-button"
                            className="inspiration__content__newsGrid__card"
                        />
                    ))
                ) : (
                    <p>Aucun article disponible.</p>
                )}
            </div>

            {/* ✅ Bouton "Charger plus" */}
            {visibleArticles < articles.length && (
                <div className="inspiration__content__loadMore">
                    <Button onClick={loadMoreArticles} className="large blue-button">
                        {isLoading ? <span className="loader"></span> : "Charger plus"}
                    </Button>
                </div>
            )}
        </section>
    );
}
