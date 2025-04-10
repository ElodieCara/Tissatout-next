"use client";
import { useState } from "react";
import Card from "@/components/Card/Card";
import Button from "@/components/Button/Button";
import Link from "next/link";

interface Article {
    id: string;
    title: string;
    slug: string;
    description: string;
    image?: string;
    date?: string;
    category?: string;
    tags?: string[];
    iconSrc?: string;
}

export default function InspirationArticles({ articles }: { articles: Article[] }) {
    const [visibleArticles, setVisibleArticles] = useState(10);
    const [isLoading, setIsLoading] = useState(false);

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
                {articles.slice(0, visibleArticles).map((article) => (
                    <Link key={article.id} href={`/articles/${article.slug}`}>
                        <Card
                            cover={article.image || "/default-image.png"}
                            title={article.title}
                            date={article.date}
                            category={article.category}
                            tags={article.tags || []}
                            iconSrc={article.iconSrc || ""}
                            content={article.description}
                            type="large"
                            buttonColor="yellow-button"
                            className="inspiration__content__newsGrid__card"
                        />
                    </Link>
                ))}
            </div>


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
