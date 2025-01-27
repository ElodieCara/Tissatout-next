import React, { useEffect, useState } from "react";

const SpringDecorations: React.FC = () => {
    const decorations = [
        "decoration-flower", // Fleur
        "decoration-butterfly", // Papillon
        "decoration-rainbow", // Arc-en-ciel
    ];

    const [mainHeight, setMainHeight] = useState(0);

    useEffect(() => {
        const mainElement = document.querySelector("main");
        if (mainElement) {
            setMainHeight(mainElement.scrollHeight);
        }
    }, []);

    const repeatedDecorations = Array.from({ length: 20 }, (_, i) => {
        const baseClass = decorations[i % decorations.length];
        const top = (i / 20) * (mainHeight * 0.8);
        const horizontalOffset = 5 + (i % 5) * 3;

        return {
            className: `decoration ${baseClass}`,
            style: {
                top: `${top}px`,
                right: `${horizontalOffset}vw`,
            },
        };
    });

    return (
        <div className="spring-decorations">
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

export default SpringDecorations;
