"use client";

import { useState, useEffect } from "react";
import Banner from "@/components/Banner/Banner";
import Head from "next/head";

import Button from "@/components/Button/Button";
import Card from "@/components/Card/Card";
import FloatingIcons from "@/components/FloatingIcon/FloatingIcons";

// Définition du type pour un article
interface Article {
    id: string;
    title: string;
    content: string;
    description?: string;
    image?: string;
    iconSrc?: string;
    date?: string;
    category?: string;
    tags?: string[];
}

const categories = [
    { key: "articles", label: "💡 Inspirations" },
    { key: "idees", label: "🔥 Idées" },
    { key: "conseils", label: "📝 Conseils" }
];

export default function Inspiration() {
    const [selectedCategory, setSelectedCategory] = useState("articles");
    const [articles, setArticles] = useState<Article[]>([]);
    const [visibleArticles, setVisibleArticles] = useState(10);
    const [isLoading, setIsLoading] = useState(false);

    const formatDate = (dateString?: string) => {
        if (!dateString) return "Date inconnue"; // ✅ Gestion des cas où la date est absente

        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, "0"); // ✅ Ajoute un zéro devant si nécessaire
        const month = (date.getMonth() + 1).toString().padStart(2, "0"); // ✅ Les mois commencent à 0 en JS
        const year = date.getFullYear().toString().slice(-2); // ✅ Prend les 2 derniers chiffres de l'année

        return `${day}-${month}-${year}`;
    };

    // ✅ Fonction pour charger plus d'articles
    const loadMoreArticles = () => {
        setIsLoading(true); // Active l'animation
        setTimeout(() => {
            setVisibleArticles(visibleArticles + 3);
            setIsLoading(false); // Désactive après le chargement
        }, 1500); // Simule un délai de 1.5s
    };


    useEffect(() => {
        fetch("/api/articles")
            .then((res) => res.json())
            .then((data: Article[]) => setArticles(data))
            .catch((err) => console.error("Erreur lors de la récupération des articles :", err));
    }, []);

    return (
        <>
            <Head>
                <title>Inspiration & Conseils ✨</title>
                <meta name="description" content="Découvrez des idées créatives et des conseils pour accompagner l'éveil des enfants !" />
            </Head>

            <div className="inspiration">
                <FloatingIcons />
                <header className="inspiration__header">
                    <Banner
                        src="/assets/slide3.png"
                        title="💡 Inspiration & Conseils"
                        description="Trouvez des idées d’activités et des conseils adaptés à chaque saison et moment clé du développement !"
                    />
                </header>

                <div className="inspiration__filterButtons">
                    {categories.map(({ key, label }) => (
                        <Button
                            key={key}
                            className={`${selectedCategory === key ? "large yellow-button" : "small blue-button"}`}
                            onClick={() => setSelectedCategory(key)}
                        >
                            {label}
                        </Button>
                    ))}
                </div>

                <section className="inspiration__content">
                    {selectedCategory === "articles" && (
                        <>
                            <section className="container__news">
                                <h2>🌟 Tous les articles</h2>
                                <div className="inspiration__content__newsGrid">
                                    {articles.length > 0 ? (
                                        articles.map((article) => (
                                            <Card
                                                key={article.id}
                                                cover={article.image || "/default-image.png"}
                                                title={article.title}
                                                date={formatDate(article.date)}
                                                category={article.category}
                                                tags={article.tags || []}
                                                iconSrc={article.iconSrc || ""} // ✅ Ajout ici
                                                content={article.description || article.content.substring(0, 100) + "..."}
                                                type="large"
                                                buttonColor="yellow-button"
                                                className=
                                                "inspiration__content__newsGrid__card"
                                            />

                                        ))
                                    ) : (
                                        <p>Aucun article disponible.</p>
                                    )}
                                </div>

                                {/* ✅ Bouton "Plus" pour charger d'autres articles */}
                                {visibleArticles < articles.length && (
                                    <div className="inspiration__content__loadMore">
                                        <Button onClick={loadMoreArticles} className="large blue-button">
                                            Charger plus
                                        </Button>
                                    </div>
                                )}
                            </section>
                        </>
                    )}

                    {selectedCategory === "idees" && (
                        <div>
                            <h2>🔥 Idées par saison et événements</h2>
                            <ul>
                                <li>❄️ Hiver</li>
                                <li>🌸 Printemps</li>
                                <li>🌞 Été</li>
                                <li>🍂 Automne</li>
                                <li>🎄 Noël</li>
                                <li>🎃 Halloween</li>
                                <li>🐣 Pâques</li>
                            </ul>
                        </div>
                    )}

                    {selectedCategory === "conseils" && (
                        <div>
                            <h2>📝 Conseils & Astuces</h2>
                            <ul>
                                <li>🌱 Développement de l’enfant</li>
                                <li>🎭 Éveil créatif et jeux éducatifs</li>
                                <li>📚 Conseils pédagogiques pour parents & éducateurs</li>
                            </ul>
                        </div>
                    )}
                </section>
            </div>
        </>
    );
}
