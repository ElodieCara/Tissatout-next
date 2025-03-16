"use client";

import { useState } from "react";
import InspirationArticles from "./components/InspirationArticles";
import InspirationIdeas from "./components/InspirationIdeas";
import InspirationAdvice from "./components/InspirationAdvice";
import FloatingIcons from "@/components/FloatingIcon/FloatingIcons";
import BackToTop from "@/components/BackToTop/BackToTop";
import Banner from "@/components/Banner/Banner";
import Button from "@/components/Button/Button";

// ✅ Sections disponibles
const categories = [
    { key: "articles", label: "💡 Inspirations" },
    { key: "ideas", label: "🔥 Idées" },
    { key: "advice", label: "📝 Conseils" }
];

export default function InspirationPage({ articles, ideas, advices }: { articles: any[], ideas: any[], advices: any[] }) {
    const [selectedCategory, setSelectedCategory] = useState("articles"); // 🔵 État de la section active

    return (
        <>
            <FloatingIcons />
            <BackToTop />
            <header className="inspiration__header">
                <Banner
                    src="/assets/slide3.png"
                    title="💡 Inspiration & Conseils"
                    description="Trouvez des idées d’activités et des conseils adaptés à chaque saison et moment clé du développement !"
                />
            </header>

            {/* 🔵 Navigation dynamique entre les sections */}
            <div className="inspiration__filterButtons">
                {categories.map(({ key, label }) => (
                    <Button
                        key={key}
                        className={`filter-button ${selectedCategory === key ? "active yellow-button" : "blue-button"}`}
                        onClick={() => setSelectedCategory(key)}
                    >
                        {label}
                    </Button>
                ))}
            </div>

            {/* 🔥 Affichage conditionnel selon la section sélectionnée */}
            <section className="inspiration__content">
                {selectedCategory === "articles" && <InspirationArticles articles={articles} />}
                {selectedCategory === "ideas" && <InspirationIdeas ideas={ideas} />}
                {selectedCategory === "advice" && <InspirationAdvice advices={advices} />}
            </section>
        </>
    );
}
