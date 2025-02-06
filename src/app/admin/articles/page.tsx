"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Breadcrumb from "../components/Breadcrumb";

interface Article {
    id: string;
    title: string;
    date?: string;
}

export default function ArticlesPage() {
    const [articles, setArticles] = useState<Article[]>([]);

    useEffect(() => {
        fetch("/api/articles")
            .then((res) => res.json())
            .then((data) => setArticles(data));
    }, []);

    return (
        <div className="admin">
            <Breadcrumb />
            <h1 className="admin__title">📄 Gestion des Articles</h1>

            <div className="admin__actions">
                <Link href="/admin/articles/new" className="admin__button">➕ Ajouter un Article</Link>
            </div>

            <div className="admin__list">
                {articles.length === 0 ? (
                    <p>Aucun article pour l’instant.</p>
                ) : (
                    <ul>
                        {articles.map((article) => (
                            <li key={article.id} className="admin__list-item">
                                <span>{article.title}</span>
                                {article.date && <small>🗓️ {article.date}</small>}
                                <div className="admin__actions">
                                    <Link href={`/admin/articles/${article.id}`} className="admin__button edit">✏️ Modifier</Link>
                                    <button className="admin__button delete">🗑️ Supprimer</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
