"use client";

import { useState, useEffect } from "react";
import Banner from "@/components/Banner/Banner";
import Head from "next/head";
import BackToTop from "@/components/BackToTop/BackToTop";
import Button from "@/components/Button/Button";
import Card from "@/components/Card/Card";
import FloatingIcons from "@/components/FloatingIcon/FloatingIcons";

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

interface Idea {
    id: string;
    title: string;
    description: string;
    image?: string;
    theme: string;
    createdAt: string;
}

const categories = [
    { key: "articles", label: "💡 Inspirations" },
    { key: "idees", label: "🔥 Idées" },
    { key: "conseils", label: "📝 Conseils" }
];

const themes = [
    { key: "", label: "🌍 Tout afficher" }, // Affiche toutes les idées par défaut
    { key: "Hiver", label: "❄️ Hiver" },
    { key: "Printemps", label: "🌸 Printemps" },
    { key: "Été", label: "🌞 Été" },
    { key: "Automne", label: "🍂 Automne" },
    { key: "Noël", label: "🎄 Noël" },
    { key: "Halloween", label: "🎃 Halloween" },
    { key: "Pâques", label: "🐣 Pâques" }
];

const themeMapping: Record<string, string> = {
    "Hiver": "winter",
    "Printemps": "spring",
    "Été": "summer",
    "Automne": "autumn",
    "Noël": "christmas",
    "Halloween": "halloween",
    "Pâques": "easter"
};

export default function Inspiration() {
    const [selectedCategory, setSelectedCategory] = useState("articles");
    const [articles, setArticles] = useState<Article[]>([]);
    const [allIdeas, setAllIdeas] = useState<Idea[]>([]); // Stocke toutes les idées
    const [filteredIdeas, setFilteredIdeas] = useState<Idea[]>([]); // Stocke les idées filtrées
    const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [visibleArticles, setVisibleArticles] = useState(10);
    const [visibleIdeas, setVisibleIdeas] = useState(10);
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
    const loadMoreItems = (type: "articles" | "ideas") => {
        setIsLoading(true); // Active l'animation
        setTimeout(() => {
            if (type === "articles") {
                setVisibleArticles((prev) => prev + 10);
            } else {
                setVisibleIdeas((prev) => prev + 10);
            }
            setIsLoading(false); // ❌ Désactive le chargement
        }, 1500); // ⏳ Simule un délai d'1,5s
    };




    // Charger les articles
    useEffect(() => {
        fetch("/api/articles")
            .then((res) => res.json())
            .then((data) => setArticles(data))
            .catch((err) => console.error("❌ Erreur lors de la récupération des articles :", err));
    }, []);

    // Charger toutes les idées une seule fois
    useEffect(() => {
        fetch("/api/ideas")
            .then((res) => res.json())
            .then((data) => {
                setAllIdeas(data);
                setFilteredIdeas(data); // Affichage de toutes les idées par défaut
            })
            .catch((err) => {
                console.error("❌ Erreur lors de la récupération des idées :", err);
                setError("Impossible de charger les idées.");
            });
    }, []);

    // Fonction pour filtrer les idées
    const handleThemeFilter = (theme: string | null) => {
        const safeTheme = theme ?? ""; // ✅ Remplace null par une chaîne vide
        console.log("🟢 Thème sélectionné :", safeTheme);

        setSelectedTheme(safeTheme);

        const themeEn = themeMapping[safeTheme] || safeTheme;
        console.log("🌍 Thème converti en anglais :", themeEn);

        if (themeEn) {
            const filtered = allIdeas.filter((idea) =>
                idea.theme.toLowerCase() === themeEn.toLowerCase()
            );

            console.log("📌 Idées filtrées :", filtered);
            setFilteredIdeas(filtered);
        } else {
            console.log("🌍 Affichage de toutes les idées.");
            setFilteredIdeas(allIdeas);
        }
    };




    return (
        <>
            <Head>
                <title>Inspiration & Conseils ✨</title>
                <meta name="description" content="Découvrez des idées créatives et des conseils pour accompagner l'éveil des enfants !" />
            </Head>

            <div className="inspiration">
                <FloatingIcons />
                <BackToTop />
                <header className="inspiration__header">
                    <Banner
                        src="/assets/slide3.png"
                        title="💡 Inspiration & Conseils"
                        description="Trouvez des idées d’activités et des conseils adaptés à chaque saison et moment clé du développement !"
                    />
                </header>

                {/* Boutons pour changer de catégorie */}
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
                    {/* Affichage des articles */}
                    {selectedCategory === "articles" && (
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
                                            iconSrc={article.iconSrc || ""}
                                            content={article.description || article.content.substring(0, 100) + "..."}
                                            type="large"
                                            buttonColor="yellow-button"
                                            className="inspiration__content__newsGrid__card"
                                        />
                                    ))
                                ) : (
                                    <p>Aucun article disponible.</p>
                                )}
                            </div>
                            {/* ✅ Bouton "Plus" pour charger d'autres articles */}
                            {visibleArticles < articles.length && (
                                <div className="inspiration__content__loadMore">
                                    <Button onClick={() => loadMoreItems("articles")} className="large blue-button">
                                        {isLoading ? <span className="loader"></span> : "Charger plus"}
                                    </Button>
                                </div>
                            )}

                        </section>
                    )}

                    {/* Affichage des idées + filtres */}
                    {selectedCategory === "idees" && (
                        <section className="container__inspiration--ideas">
                            <h2>🔥 Idées {selectedTheme ? `pour ${selectedTheme}` : "toutes saisons confondues"}</h2>

                            {/* Filtres par catégories (Saisons et Fêtes) */}
                            <div className="container__inspiration__filters">
                                <div className="container__inspiration__filters-buttons">
                                    {themes.map(({ key, label }) => (
                                        <div key={label} className="filter-circle-wrapper">
                                            <button
                                                className={`filter-circle ${selectedTheme === key ? "active" : ""}`}
                                                onClick={() => handleThemeFilter(key)}
                                            >
                                                <span className="filter-circle__icon">{label.split(" ")[0]}</span>
                                            </button>
                                            <span className="filter-circle__text">{label.split(" ")[1]}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {error ? <p className="error">{error}</p> : null}

                            <div className="container__inspiration--ideas-content">
                                {filteredIdeas.length > 0 ? (
                                    filteredIdeas.map((idea) => {
                                        const formattedDate = new Date(idea.createdAt).toLocaleDateString("fr-FR", {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric",
                                        });

                                        return (
                                            <div key={idea.id} className="inspiration__card">
                                                <div className="inspiration__card__image">
                                                    <img src={idea.image || "/default-idea.png"} alt={idea.title} />
                                                </div>
                                                <div className="inspiration__card__content">
                                                    <h3 className="inspiration__card__title">{idea.title}</h3>
                                                    <span className="inspiration__card__date">{formattedDate}</span>
                                                    <p className="inspiration__card__description">{idea.description}</p>
                                                    <button className="inspiration__card__button">Lire plus</button>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <p>Aucune idée disponible.</p>
                                )}
                            </div>
                            {/* 🔥 Bouton "Voir plus" avec animation */}
                            {visibleIdeas < filteredIdeas.length && (
                                <div className="inspiration__content__loadMore">
                                    <Button onClick={() => loadMoreItems("ideas")} className="large blue-button">
                                        {isLoading ? <span className="loader"></span> : "Charger plus"}
                                    </Button>
                                </div>
                            )}

                        </section>
                    )}

                    {/* Affichage des conseils */}
                    {selectedCategory === "conseils" && (
                        <section>
                            <h2>📝 Conseils & Astuces</h2>
                            <ul>
                                <li>🌱 Développement de l’enfant</li>
                                <li>🎭 Éveil créatif et jeux éducatifs</li>
                                <li>📚 Conseils pédagogiques pour parents & éducateurs</li>
                            </ul>
                        </section>
                    )}
                </section>
            </div >
        </>
    );
}
