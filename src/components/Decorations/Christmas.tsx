import React from "react";

const ChristmasDecorations: React.FC = () => {
    const decorations = [
        { className: "decoration-star-1" },
        { className: "decoration-star-2" },
        { className: "decoration-tree-1" },
        { className: "decoration-snowflake-1" },
    ];

    return (
        <>
            {decorations.map((decoration, index) => (
                <div key={index} className={decoration.className} />
            ))}
        </>
    );
};

export default ChristmasDecorations;
