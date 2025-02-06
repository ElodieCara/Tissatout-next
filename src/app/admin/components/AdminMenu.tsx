"use client";
import { useState } from "react";
import AdminArticles from "./AdminArticles";
import AdminColoring from "./AdminColoring";
import AdminNews from "./AdminNews";
import AdminIdeas from "./AdminIdeas";
import Breadcrumb from "./Breadcrumb";

export default function AdminPage() {
    const [activeSection, setActiveSection] = useState("articles");

    return (
        <div className="admin">
            <Breadcrumb />
            <nav className="admin__menu">
                <button onClick={() => setActiveSection("articles")} className={activeSection === "articles" ? "active" : ""}>
                    📄 Articles
                </button>
                <button onClick={() => setActiveSection("coloring")} className={activeSection === "coloring" ? "active" : ""}>
                    🎨 Coloriages
                </button>
                <button onClick={() => setActiveSection("news")} className={activeSection === "news" ? "active" : ""}>
                    📰 Actualités
                </button>
                <button onClick={() => setActiveSection("ideas")} className={activeSection === "ideas" ? "active" : ""}>
                    💡 Idées (Saisons, Événements)
                </button>
            </nav>

            <div className="admin__content">
                {activeSection === "articles" && <AdminArticles />}
                {activeSection === "coloring" && <AdminColoring />}
                {activeSection === "news" && <AdminNews />}
                {activeSection === "ideas" && <AdminIdeas />}
            </div>
        </div>
    );
}
