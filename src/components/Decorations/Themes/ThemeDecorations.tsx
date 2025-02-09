import React, { useEffect, useState } from "react";
import { decorationsConfig } from "@/data/decorationsConfig";
import { Theme } from "@/types/theme";

interface ThemeDecorationsProps {
    theme: Theme; // Seul le thème est nécessaire
}

const ThemeDecorations: React.FC<ThemeDecorationsProps> = ({ theme }) => {
    const [mainHeight, setMainHeight] = useState(0);

    // Récupérer les décorations correspondant au thème
    const decorations = decorationsConfig[theme] || decorationsConfig["default-theme"];

    useEffect(() => {
        const mainElement = document.querySelector("main");
        if (mainElement) {
            setMainHeight(mainElement.scrollHeight);
        }
    }, []);

    useEffect(() => {
        console.log("Theme:", theme);
        console.log("Decorations for theme:", decorations);
    }, [theme, decorations]);

    // Ne rien générer si aucune décoration n'est disponible
    if (!decorations || decorations.length === 0) {
        console.warn(`No decorations available for theme: ${theme}`);
        return null;
    }

    // Génération des décorations dynamiques
    const repeatedDecorations = Array.from({ length: 40 }, (_, i) => {
        const baseClass = decorations[i % decorations.length].className; // Récupération des classes
        const totalItems = 20;
        const top = (i / totalItems) * (mainHeight * 0.6);

        const horizontalOffset = 4 + (i % 4) * 3;
        const sideStyle =
            i % 2 === 0
                ? { left: `${horizontalOffset}vw` }
                : { right: `${horizontalOffset}vw` };

        return {
            className: `decoration ${baseClass}`,
            style: { top: `${top}px`, ...sideStyle },
        };
    });

    return (
        <div className={`${theme}-theme decorations-container`}>
            {repeatedDecorations.map((decoration, index) => (
                <div
                    key={index}
                    className={decoration.className}
                    style={decoration.style}
                />
            ))}
        </div>
    );
};

export default ThemeDecorations;