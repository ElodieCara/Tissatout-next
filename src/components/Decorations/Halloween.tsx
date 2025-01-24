import React from "react";

const HalloweenDecorations: React.FC = () => {
    const decorations = [
        { className: "decoration-pumpkin-1" },
        { className: "decoration-bat-1" },
        { className: "decoration-ghost-1" },
    ];

    return (
        <>
            {decorations.map((decoration, index) => (
                <div key={index} className={decoration.className} />
            ))}
        </>
    );
};

export default HalloweenDecorations;
