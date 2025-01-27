import React from "react";

const WinterDecorations: React.FC = () => {
    const decorations = [
        { className: "decoration-snowflake-1" },
        { className: "decoration-snowflake-2" },
        { className: "decoration-icicle-1" },
    ];

    return (
        <>
            {decorations.map((decoration, index) => (
                <div key={index} className={decoration.className} />
            ))}
        </>
    );
};

export default WinterDecorations;
