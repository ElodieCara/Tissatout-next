"use client";
import { useState } from "react";
import Button from "@/components/Button/Button";
import Link from "next/link";


interface Idea {
    id: string;
    slug: string;
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
    { key: "Pâques", label: "🐣 Pâques" },
    { key: "Toussaint", label: "🕯️ Toussaint" },
    { key: "Saint-Jean", label: "🔥 Saint-Jean" },
    { key: "Épiphanie", label: "👑 Épiphanie" },
    { key: "Chandeleur", label: "🕯️ Chandeleur" }
];

const themeMapping: Record<string, string> = {
    "Hiver": "winter",
    "Printemps": "spring",
    "Été": "summer",
    "Automne": "autumn",
    "Noël": "christmas",
    "Pâques": "easter",
    "Toussaint": "toussaint",
    "Saint-Jean": "saint-jean",
    "Épiphanie": "epiphanie",
    "Chandeleur": "chandeleur"
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

                        <Link key={idea.id} href={`/idees/${idea.slug}`} className="inspiration__card">
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
                        </Link>

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
