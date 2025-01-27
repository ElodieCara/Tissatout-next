import React, { useEffect } from "react";
import { Theme } from "@/types/theme";

// Propriétés acceptées par le composant
interface ThemeIconProps {
    theme: Theme; // Thème actuel
}

const ThemeIcon: React.FC<ThemeIconProps> = ({ theme }) => {
    console.log("ThemeIcon -> theme:", theme);
    // Images dynamiques par thème
    const themeImages: Record<Theme, string> = {
        "back-to-school-theme": "/assets/bts.png",
        "easter-theme": "assets/paques.png",
        "default-theme": "/assets/default.png",
        "summer-theme": "/assets/sun.png",
        "winter-theme": "/assets/winter.png",
        "spring-theme": "/assets/bees.png",
        "autumn-theme": "/assets/autumn.png",
        "halloween-theme": "/assets/pumpkin.png",
        "christmas-theme": "/assets/christmas.png",
    };

    useEffect(() => {
        console.log("ThemeIcon re-render -> theme:", theme);
    }, [theme]);

    const themeImage = themeImages[theme]; // Obtenir l'image correspondant au thème

    console.log("ThemeIcon -> theme:", theme);
    console.log("ThemeIcon -> normalizedTheme:", theme);
    console.log("ThemeIcon -> themeImage:", themeImage);

    // Si aucun thème valide, ne rien afficher
    if (!themeImage) return null;

    return (
        <div className="container__section__theme">
            <img src={themeImage} alt={`${theme} icon`} className="theme-icon" />
        </div>
    );
};

export default ThemeIcon;
