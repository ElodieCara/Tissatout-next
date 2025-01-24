import React from "react";

const SummerDecorations: React.FC = () => {
    const decorations = [
        { className: "decoration decoration-star-1" },
        { className: "decoration decoration-star-2" },
        { className: "decoration decoration-rocket-1" },
        { className: "decoration decoration-rocket-2" },
        { className: "decoration decoration-balloon-1" },
        { className: "decoration decoration-balloon-2" },
    ];

    return (
        <>
            {decorations.map((decoration, index) => (
                <div key={index} className={decoration.className} />
            ))}
        </>
    );
};

export default SummerDecorations;
