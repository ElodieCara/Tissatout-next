"use client";
import { useState } from "react";
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

export default function InspirationIdeas({ ideas }: { ideas: Idea[] }) {
    const [visibleIdeas, setVisibleIdeas] = useState(10);
    const [selectedTheme, setSelectedTheme] = useState<string>("");

    const handleThemeFilter = (theme: string) => {
        setSelectedTheme(theme);
    };

    const filteredIdeas = selectedTheme
        ? ideas.filter((idea) => idea.theme.toLowerCase() === (themeMapping[selectedTheme] || selectedTheme).toLowerCase())
        : ideas;

    const loadMoreIdeas = () => {
        setVisibleIdeas((prev) => prev + 10);
    };

    return (
        <section className="container__inspiration--ideas">
            <h2>🔥 Idées {selectedTheme ? `pour ${selectedTheme}` : "toutes saisons confondues"}</h2>

            {/* 🔵 Filtres par thème */}
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

            {/* 🔥 Liste des idées filtrées */}
            <div className="container__inspiration--ideas-content">
                {filteredIdeas.length > 0 ? (
                    filteredIdeas.slice(0, visibleIdeas).map((idea) => (
                        <div key={idea.id} className="inspiration__card">
                            <div className="inspiration__card__image">
                                <img src={idea.image || "/default-idea.png"} alt={idea.title} />
                            </div>
                            <div className="inspiration__card__content">
                                <h3 className="inspiration__card__title">{idea.title}</h3>
                                <span className="inspiration__card__date">
                                    {new Date(idea.createdAt).toLocaleDateString("fr-FR")}
                                </span>
                                <p className="inspiration__card__description">{idea.description}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Aucune idée disponible.</p>
                )}
            </div>

            {/* ✅ Bouton "Voir plus" */}
            {visibleIdeas < filteredIdeas.length && (
                <div className="inspiration__content__loadMore">
                    <Button onClick={loadMoreIdeas} className="large blue-button">
                        Charger plus
                    </Button>
                </div>
            )}
        </section>
    );
}
