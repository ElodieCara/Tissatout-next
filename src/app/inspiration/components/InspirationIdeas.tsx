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
    { key: "", icon: "/icons/themes/monde.png", label: "Tout afficher" },
    { key: "Hiver", icon: "/icons/themes/hiver.png", label: "Hiver" },
    { key: "Printemps", icon: "/icons/themes/printemps.png", label: "Printemps" },
    { key: "Été", icon: "/icons/themes/soleil.png", label: "Été" },
    { key: "Automne", icon: "/icons/themes/automne.png", label: "Automne" },
    { key: "Noël", icon: "/icons/themes/noel.png", label: "Noël" },
    { key: "Pâques", icon: "/icons/themes/paque.png", label: "Pâques" },
    { key: "Toussaint", icon: "/icons/themes/toussaint.png", label: "Toussaint" },
    { key: "Saint-Jean", icon: "/icons/themes/saintjean.png", label: "Saint-Jean" },
    { key: "Épiphanie", icon: "/icons/themes/epiphanie.png", label: "Épiphanie" },
    { key: "Chandeleur", icon: "/icons/themes/chandeleur.png", label: "Chandeleur" }
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
            <h2>Idées {selectedTheme ? `pour ${selectedTheme}` : "toutes saisons confondues"}</h2>

            {/* 🔵 Filtres par thème */}
            <div className="container__inspiration__filters">
                <div className="container__inspiration__filters-buttons">
                    {themes.map(({ key, label, icon }) => (
                        <div key={label} className="filter-circle-wrapper">
                            <button
                                className={`filter-circle ${selectedTheme === key ? "active" : ""}`}
                                onClick={() => handleThemeFilter(key)}
                            >
                                <img
                                    src={icon}
                                    alt={`Icône ${label}`}
                                    className="filter-circle__icon"
                                    width={42}
                                    height={42}
                                />
                            </button>
                            <span className="filter-circle__text">{label}</span>
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
