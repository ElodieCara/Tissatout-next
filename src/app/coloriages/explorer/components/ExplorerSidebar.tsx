import React from "react";

type ExplorerSidebarProps = {
    categories: Record<string, string[]>;
    selectedTheme: string | null;
    onThemeSelect: (theme: string) => void;
};

const ExplorerSidebar: React.FC<ExplorerSidebarProps> = ({ categories, selectedTheme, onThemeSelect }) => {
    return (
        <aside className="explorer-sidebar">
            <h3>Catégories</h3>
            <ul>
                {Object.keys(categories).map((theme) => (
                    <li key={theme} className={selectedTheme === theme ? "active" : ""}>
                        <button onClick={() => onThemeSelect(theme)}>{theme}</button>
                    </li>
                ))}
            </ul>
        </aside>
    );
};

export default ExplorerSidebar;
