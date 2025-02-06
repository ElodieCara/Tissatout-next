"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface Article {
    id: string;
    title: string;
    content: string;
    image?: string;
    description?: string;
    date?: string;
}

export default function ArticlesPage() {
    const [articles, setArticles] = useState<Article[]>([]);

    useEffect(() => {
        fetch("/api/articles") // 🔹 Récupération des articles depuis l'API
            .then((res) => res.json())
            .then((data) => setArticles(data))
            .catch((err) => console.error("Erreur lors de la récupération des articles :", err));
    }, []);

    return (
        <main className="container">
            <h1 className="title">Articles</h1>
            <div className="articles-list">
                {articles.length > 0 ? (
                    articles.map((article) => (
                        <Link href={`/articles/${article.id}`} key={article.id} className="article-card">
                            <div className="article-card__image">
                                {article.image && <Image src={article.image} alt={article.title} width={300} height={200} />}
                            </div>
                            <h2 className="article-card__title">{article.title}</h2>
                            <p className="article-card__content">
                                {article.description || article.content.substring(0, 100) + "..."}
                            </p>
                            <p className="article-card__date">{article.date || "Date inconnue"}</p>
                        </Link>
                    ))
                ) : (
                    <p>Aucun article disponible.</p>
                )}
            </div>
        </main>
    );
}
