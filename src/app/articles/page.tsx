import Link from "next/link";
import Image from "next/image";
import { getArticles } from "@/lib/articles";

export const metadata = {
    title: "Articles - Tissatout",
    description: "Découvrez les derniers articles publiés sur Tissatout : pédagogie, activités et coloriages.",
};

export default async function ArticlesPage() {
    const articles = await getArticles(); // 🔥 Chargement côté serveur

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
                            <p className="article-card__date">{article.date ? new Date(article.date).toLocaleDateString("fr-FR") : "Date inconnue"}</p>
                        </Link>
                    ))
                ) : (
                    <p>Aucun article disponible.</p>
                )}
            </div>
        </main>
    );
}
