"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Article {
    id: string;
    title: string;
    image?: string;
}

export default function AdminArticles() {
    const [articles, setArticles] = useState<Article[]>([]);
    const router = useRouter();

    useEffect(() => {
        fetch("/api/articles")
            .then((res) => res.json())
            .then((data) => setArticles(data));
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Voulez-vous vraiment supprimer cet article ?")) return;

        const res = await fetch(`/api/articles/${id}`, { method: "DELETE" });
        if (res.ok) {
            setArticles(articles.filter((article) => article.id !== id));
        }
    };

    return (
        <div className="admin__section">
            <h2>Gestion des Articles 📄</h2>
            <button onClick={() => router.push("/admin/articles/new")} className="admin__button">
                ➕ Ajouter un Article
            </button>
            <div className="admin__list">
                {Array.isArray(articles) ? (
                    articles.map((article) => (
                        <div key={article.id} className="admin__list-item">
                            {article.image && <img src={article.image} alt={article.title} width="80" />}
                            <span>{article.title}</span>
                            <button onClick={() => router.push(`/admin/articles/${article.id}`)}>✏️ Modifier</button>
                            <button onClick={() => handleDelete(article.id)}>🗑️ Supprimer</button>
                        </div>
                    ))
                ) : (
                    <p>Aucun article disponible.</p>
                )}
            </div>
        </div>
    );
}
