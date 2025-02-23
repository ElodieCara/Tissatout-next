"use client";
import { useState } from "react";
import Banner from "@/components/Banner/Banner";
import BackToTop from "@/components/BackToTop/BackToTop";
import FloatingIcons from "@/components/FloatingIcon/FloatingIcons";
import InspirationArticles from "./components/InspirationArticles";
import InspirationIdeas from "./components/InspirationIdeas";
import InspirationAdvice from "./components/InspirationAdvice";
import Button from "@/components/Button/Button";

const categories = [
    { key: "articles", label: "💡 Inspirations" },
    { key: "ideas", label: "🔥 Idées" },
    { key: "advice", label: "📝 Conseils" }
];

export default function InspirationPage() {
    const [selectedCategory, setSelectedCategory] = useState("articles");

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

            {/* 🟢 Boutons de navigation entre les sections */}
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

            {/* 🔥 Affichage dynamique selon la section sélectionnée */}
            <section className="inspiration__content">
                {selectedCategory === "articles" && <InspirationArticles />}
                {selectedCategory === "ideas" && <InspirationIdeas />}
                {selectedCategory === "advice" && <InspirationAdvice />}
            </section>
        </>
    );
}
