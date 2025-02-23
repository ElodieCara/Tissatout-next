"use client";
import { useState, useEffect } from "react";
import Button from "@/components/Button/Button";

interface Idea {
    id: string;
    title: string;
    description: string;
    theme: string;
    image?: string;
    createdAt: string;
}

const themes = [
    { key: "", label: "🌍 Tout afficher" },
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

export default function InspirationIdeas() {
    const [ideas, setIdeas] = useState<Idea[]>([]);
    const [allIdeas, setAllIdeas] = useState<Idea[]>([]); // Stocke toutes les idées initiales
    const [selectedTheme, setSelectedTheme] = useState<string>("");
    const [visibleIdeas, setVisibleIdeas] = useState(10);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch("/api/ideas")
            .then((res) => res.json())
            .then((data: Idea[]) => {
                setAllIdeas(data);
                setIdeas(data); // Affichage de toutes les idées par défaut
            })
            .catch(() => setError("Impossible de charger les idées."));
    }, []);

    const handleThemeFilter = (theme: string) => {
        setSelectedTheme(theme);
        const themeEn = themeMapping[theme] || theme; // Convertit le thème en anglais si nécessaire

        if (themeEn) {
            const filtered = allIdeas.filter((idea) => idea.theme.toLowerCase() === themeEn.toLowerCase());
            setIdeas(filtered);
        } else {
            setIdeas(allIdeas);
        }
    };

    const loadMoreIdeas = () => {
        setIsLoading(true);
        setTimeout(() => {
            setVisibleIdeas((prev) => prev + 10);
            setIsLoading(false);
        }, 1500);
    };

    return (
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
                {ideas.length > 0 ? (
                    ideas.slice(0, visibleIdeas).map((idea) => {
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
            {visibleIdeas < ideas.length && (
                <div className="inspiration__content__loadMore">
                    <Button onClick={loadMoreIdeas} className="large blue-button">
                        {isLoading ? <span className="loader"></span> : "Charger plus"}
                    </Button>
                </div>
            )}
        </section>
    );
}
