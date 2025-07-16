import React from "react";

type ExplorerSidebarProps = {
    categories: Record<string, string[]>;
    selectedTheme: string | null;
    onThemeSelect: (theme: string | null) => void; // <-- accepter null maintenant
};

const ExplorerSidebar: React.FC<ExplorerSidebarProps> = ({ categories, selectedTheme, onThemeSelect }) => {
    return (
        <aside className="explorer-sidebar">
            <h3>Catégories</h3>
            <ul>
                {/* 🏠 Bouton accueil coloriages */}
                <li className={!selectedTheme ? "active" : ""}>
                    <button onClick={() => onThemeSelect(null)}>Tous les coloriages</button>
                </li>

                {/* 🆕 Bouton nouveautés */}
                <li className={selectedTheme === "Nouveautés" ? "active" : ""}>
                    <button onClick={() => onThemeSelect("Nouveautés")}>Nouveautés</button>
                </li>

                {/* 🔁 Liste des thèmes */}
                {Object.keys(categories || {}).map((theme) => (
                    <li key={theme} className={selectedTheme === theme ? "active" : ""}>
                        <button onClick={() => onThemeSelect(theme)}>{theme}</button>
                    </li>
                ))}
            </ul>
        </aside>
    );
};

export default ExplorerSidebar;
