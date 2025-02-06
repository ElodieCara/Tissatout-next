import { useEffect, useState } from "react";

interface Article {
    id: string;
    title: string;
    image?: string;
}

export default function AdminList() {
    const [articles, setArticles] = useState<Article[]>([]);

    useEffect(() => {
        fetch("/api/articles")
            .then((res) => res.json())
            .then((data) => setArticles(data));
    }, []);

    const handleDelete = async (id: string) => {
        const res = await fetch(`/api/articles/${id}`, { method: "DELETE" });
        if (res.ok) {
            setArticles(articles.filter((article) => article.id !== id));
        }
    };

    return (
        <div className="admin__list">
            <h2 className="admin__list-title">Liste des Articles</h2>
            {articles.map((article) => (
                <div key={article.id} className="admin__list-item">
                    {article.image && <img src={article.image} alt={article.title} width="100" className="admin__list-item-image" />}
                    <span className="admin__list-item-title">{article.title}</span>
                    <button onClick={() => handleDelete(article.id)} className="admin__list-item-button">Supprimer</button>
                </div>
            ))}
        </div>
    );
}
