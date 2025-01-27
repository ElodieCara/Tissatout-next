import React, { useEffect, useState } from "react";

interface Decoration {
    className: string;
}

interface ThemeDecorationsProps {
    decorations: Decoration[];
    theme: string;
}

const ThemeDecorations: React.FC<ThemeDecorationsProps> = ({ decorations, theme }) => {
    const [mainHeight, setMainHeight] = useState(0);

    useEffect(() => {
        const mainElement = document.querySelector("main");
        if (mainElement) {
            setMainHeight(mainElement.scrollHeight);
        }
    }, []);

    useEffect(() => {
        console.log("Theme:", theme);
        console.log("Received decorations:", decorations);
    }, [theme, decorations]);

    // Ne générez rien si `decorations` est vide
    if (!decorations || decorations.length === 0) {
        console.warn(`No decorations available for theme: ${theme}`);
        return null;
    }

    const repeatedDecorations = Array.from({ length: 32 }, (_, i) => {
        const baseClass = decorations[i % decorations.length].className; // Sécurisé maintenant
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
        <div className={`${theme}-decorations decorations-container`}>
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
