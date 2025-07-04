"use client";

import { useSearchParams, useRouter } from "next/navigation";
import AdminArticles from "./AdminArticles";
import AdminColoring from "./AdminColoring";
import AdminNews from "./AdminLesson";
import AdminIdeas from "./AdminIdeas";
import Breadcrumb from "../components/Breadcrumb";
import AdminAdvice from "./AdminAdvice";
import AdminAgeCategory from "./AdminAgeCategory";
import AdminSiteSettings from "./AdminSiteSettings";
import AdminCommentsPage from "./AdminComments";
import AdminLesson from "./AdminLesson";
import AdminPrintableGames from "./AdminPrintableGames";
import AdminSubscribersPage from "./AdminSubscribersPage";
import { LogoutButton } from "@/app/admin/logout/page";



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

            <div style={{ display: "flex", justifyContent: "flex-end", padding: "1rem" }}>
                <LogoutButton />
            </div>

            <nav className="admin__menu">
                <button
                    onClick={() => handleSectionChange("ageCategory")}
                    className={activeSection === "ageCategory" ? "active" : ""}
                >
                    👶 Catégories d’âge
                </button>
                <button
                    onClick={() => handleSectionChange("settings")}
                    className={activeSection === "settings" ? "active" : ""}
                >
                    🎛️ Bannières
                </button>
                <button
                    onClick={() => handleSectionChange("comments")}
                    className={activeSection === "comments" ? "active" : ""}
                >
                    💬 Commentaires
                </button>
                <button
                    onClick={() => handleSectionChange("subscribers")}
                    className={activeSection === "subscribers" ? "active" : ""}
                >
                    📧 Abonnés
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
                    onClick={() => handleSectionChange("modules")}
                    className={activeSection === "modules" ? "active" : ""}
                >
                    📚 Leçons
                </button>
                <button
                    onClick={() => handleSectionChange("printable")}
                    className={activeSection === "printable" ? "active" : ""}
                >
                    🧾 Activités à imprimer
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
                {activeSection === "settings" && <AdminSiteSettings />}
                {activeSection === "articles" && <AdminArticles />}
                {activeSection === "coloring" && <AdminColoring />}
                {activeSection === "modules" && <AdminLesson />}
                {activeSection === "ideas" && <AdminIdeas />}
                {activeSection === "advice" && <AdminAdvice />}
                {activeSection === "printable" && <AdminPrintableGames />}
                {activeSection === "ageCategory" && <AdminAgeCategory />}
                {activeSection === "comments" && <AdminCommentsPage />}
                {activeSection === "subscribers" && <AdminSubscribersPage />}
            </div>
        </div>
    );
}
