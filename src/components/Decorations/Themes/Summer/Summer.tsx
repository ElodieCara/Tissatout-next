import React, { useEffect, useState } from "react";


const SummerDecorations: React.FC = () => {
    // Liste des décorations avec leurs classes CSS
    const decorations = [
        "decoration-star", // Étoile
        "decoration-balloon", // Ballon
        "decoration-rocket", // Rocket
    ];

    // Stocker la hauteur totale de <main> et la position du conteneur "container__slide"
    const [mainHeight, setMainHeight] = useState(0);
    const [slideOffset, setSlideOffset] = useState<{ top: number; bottom: number }>({
        top: 0,
        bottom: 0,
    });


    // Calculer la hauteur de <main> et la position du conteneur "container__slide"
    useEffect(() => {
        const mainElement = document.querySelector("main");
        const slideElement = document.querySelector(".container__slide");

        if (mainElement) {
            setMainHeight(mainElement.scrollHeight);
        }
        if (slideElement) {
            const { top, height } = slideElement.getBoundingClientRect();
            setSlideOffset({
                top: top + window.scrollY,
                bottom: top + window.scrollY + height,
            });
        }
    }, []);

    // Générer des décorations sur les côtés gauche et droit
    const repeatedDecorations = Array.from({ length: 32 }, (_, i) => {
        const baseClass = decorations[i % decorations.length]; // Alterner entre étoile, ballon, rocket
        const totalItems = 20;
        const top = (i / totalItems) * (mainHeight * 0.6); // Réduire proportionnellement à la hauteur

        const horizontalOffset = 4 + (i % 4) * 3; // Décalage progressif
        const sideStyle =
            i % 2 === 0
                ? { left: `${horizontalOffset}vw` }
                : { right: `${horizontalOffset}vw` };

        // Exclure les décorations dans la zone du conteneur "container__slide"
        if (top >= slideOffset.top && top <= slideOffset.bottom) {
            return null;
        }

        return {
            className: `decoration ${baseClass}`,
            style: { top: `${top}px`, ...sideStyle },
        };
    }).filter((decoration): decoration is NonNullable<typeof decoration> => decoration !== null);

    return (
        <div className="decorations-container">
            {/* Décorations dynamiques */}
            {repeatedDecorations.map((decoration, index) => (
                <div
                    key={index}
                    className={decoration.className}
                    style={decoration.style} // Position dynamique
                />
            ))}
        </div>
    );
};

export default SummerDecorations;
