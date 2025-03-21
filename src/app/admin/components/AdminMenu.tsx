"use client";

import { useSearchParams, useRouter } from "next/navigation";
import AdminArticles from "./AdminArticles";
import AdminColoring from "./AdminColoring";
import AdminNews from "./AdminNews";
import AdminIdeas from "./AdminIdeas";
import Breadcrumb from "./Breadcrumb";
import AdminAdvice from "./AdminAdvice";
import AdminAgeCategory from "./AdminAgeCategory";

export default function AdminPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    // 🔹 Récupérer la section active depuis l'URL (par défaut : "articles")
    const activeSection = searchParams?.get("section") ?? "articles";

    // 🔹 Fonction pour changer la section via l'URL (évite re-render inutile)
    const handleSectionChange = (section: string) => {
        router.push(`/admin?section=${section}`, { scroll: false });
    };

    return (
        <div className="admin">
            <Breadcrumb
                onThemeSelect={(theme) => console.log("Thème sélectionné:", theme)}
                onSubCategorySelect={(subCategory) => console.log("Sous-catégorie sélectionnée:", subCategory)}
            />
            <nav className="admin__menu">
                <button
                    onClick={() => handleSectionChange("ageCategory")}
                    className={activeSection === "ageCategory" ? "active" : ""}
                >
                    👶 Catégories d’âge
                </button>
            </nav>
            <nav className="admin__menu">
                <button
                    onClick={() => handleSectionChange("articles")}
                    className={activeSection === "articles" ? "active" : ""}
                >
                    📄 Articles
                </button>
                <button
                    onClick={() => handleSectionChange("coloring")}
                    className={activeSection === "coloring" ? "active" : ""}
                >
                    🎨 Coloriages
                </button>
                <button
                    onClick={() => handleSectionChange("news")}
                    className={activeSection === "news" ? "active" : ""}
                >
                    📰 Actualités
                </button>
                <button
                    onClick={() => handleSectionChange("ideas")}
                    className={activeSection === "ideas" ? "active" : ""}
                >
                    💡 Idées (Saisons, Événements)
                </button>
                <button
                    onClick={() => handleSectionChange("advice")}
                    className={activeSection === "advice" ? "active" : ""}
                >
                    📜 Conseils
                </button>
            </nav>


            <div className="admin__content">
                {activeSection === "articles" && <AdminArticles />}
                {activeSection === "coloring" && <AdminColoring />}
                {activeSection === "news" && <AdminNews />}
                {activeSection === "ideas" && <AdminIdeas />}
                {activeSection === "advice" && <AdminAdvice />}
                {activeSection === "ageCategory" && <AdminAgeCategory />}
            </div>
        </div>
    );
}
