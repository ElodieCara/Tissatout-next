import React from "react";

const BackToSchoolDecorations: React.FC = () => {
    const decorations = [
        { className: "decoration-pencil-1" },
        { className: "decoration-book-1" },
        { className: "decoration-apple-1" },
    ];

    return (
        <>
            {decorations.map((decoration, index) => (
                <div key={index} className={decoration.className} />
            ))}
        </>
    );
};

export default BackToSchoolDecorations;
