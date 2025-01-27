import React, { useState } from "react";
import { sections } from "@/data/home";
import ThemeIcon from "@/components/Decorations/Themes/ThemeIcon";
import { Theme } from "@/types/theme";
import { useTheme } from "@/components/Decorations/Themes/ThemeProvider";




const Overview: React.FC = () => {
    const [content, setContent] = useState(sections[0].title);
    const [cardImage, setCardImage] = useState(sections[0].imageCard);

    // Récupérer le thème actuel depuis le contexte
    const { theme } = useTheme();
    console.log("Overview -> theme:", theme);

    const handleSidebarClick = (section: typeof sections[0]) => {
        setContent(section.title);
        setCardImage(section.imageCard);
    };

    console.log("Overview -> theme:", theme);
    console.log("Overview -> theme (contexte):", theme);

    return (
        <div className="container__section" style={{ position: "relative" }} key={theme}>
            {/* Utilisation de ThemeIcon */}
            <ThemeIcon theme={theme} />

            {/* Contenu principal */}
            <div className="container__section__card-1">
                <ul className="container__section__card-1__sidebar">
                    {sections.map((section, index) => (
                        <li
                            key={index}
                            className={`container__section__card-1__sidebar__button container__section__card-1__sidebar__button--${section.title
                                .replace(/\s+/g, "")
                                .toLowerCase()}`}
                            onClick={() => handleSidebarClick(section)}
                        >
                            {section.title}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="container__section__card-2">
                <div className="container__section__card-2__content-panel">
                    <div className="container__section__card-2__content-panel__text">
                        <h3>{content}</h3>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    </div>
                    <div
                        className="container__section__card-2__content-panel__img"
                        style={{
                            backgroundImage: `url(${cardImage.src})`,
                            backgroundRepeat: "no-repeat",
                            backgroundSize: "contain",
                            backgroundPosition: "center",
                        }}
                    ></div>
                </div>
            </div>
        </div>
    );
};

export default Overview;
