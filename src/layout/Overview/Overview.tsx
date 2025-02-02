import React, { useState } from "react";
import { sections } from "@/data/home";
import ThemeIcon from "@/components/Decorations/Themes/ThemeIcon";
import { Theme } from "@/types/theme";
import { useTheme } from "@/components/Decorations/Themes/ThemeProvider";
import Image from "next/image";
import Link from "next/link";

const Overview: React.FC = () => {
    const [content, setContent] = useState(sections[0].content);
    const [cardImage, setCardImage] = useState(sections[0].imageCard);
    const [description, setDescription] = useState(sections[0].description);
    const [activities, setActivities] = useState(sections[0].activities);
    const [conclusion, setConclusion] = useState(sections[0].conclusion);
    const [activeSection, setActiveSection] = useState(sections[0]); // ✅ Section affichée par défaut


    // Récupérer le thème actuel depuis le contexte
    const { theme } = useTheme();
    console.log("Overview -> theme:", theme);

    const handleSidebarClick = (section: typeof sections[0]) => {
        setContent(section.content);
        setCardImage(section.imageCard);
        setDescription(section.description);
        setActivities(section.activities);
        setConclusion(section.conclusion);
        setActiveSection(section); //
    };

    console.log("cardImage :", cardImage);
    return (
        <div className="container__section" style={{ position: "relative" }} key={theme}>
            {/* Contenu principal */}
            <div className="container__section__card-1">
                <ul className="container__section__card-1__sidebar">
                    {sections.map((section, index) => (
                        <li
                            key={index}
                            className={`container__section__card-1__sidebar__button container__section__card-1__sidebar__button--${section.title
                                .replace(/\s+/g, "")
                                .toLowerCase()}`}
                            style={{
                                backgroundImage: `url(${section.buttonImage.src})`, // Restauration de l'image de fond
                                backgroundRepeat: "no-repeat",
                                backgroundSize: "auto",
                                backgroundPosition: "right bottom",
                            }}
                            onClick={() => handleSidebarClick(section)}
                        >
                            {section.title}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="container__section__card-2">
                {/* Utilisation de ThemeIcon */}
                <ThemeIcon theme={theme} />
                <div className="container__section__card-2__content-panel">
                    <div className="container__section__card-2__coontent-panel__tag">
                        {/* <Image src={ } /> */}
                    </div>
                    {/* Texte principal */}
                    <div className="container__section__card-2__content-panel__text">
                        <h3>{content}</h3>
                        <p>{description}</p>

                        {/* Liste des activités */}
                        <ul className="activities-list">
                            {activeSection.activities.map((activity, index) => (
                                <li key={index} className="activities-list__item">
                                    {/* ✅ Rend chaque activité cliquable et envoie vers la page correspondante */}
                                    <Link href={`/nos-univers/${encodeURIComponent(activeSection.title)}`}>
                                        <span className="activity-link">{activity}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        {/* Conclusion */}
                        <p className="conclusion">{conclusion}</p>
                    </div>

                    {/* Image principale */}
                    <div
                        className="container__section__card-2__content-panel__img">
                        <Image
                            src={cardImage.src}
                            alt="Image de la section"
                            layout="fill"
                            objectFit="contain"
                        />
                    </div>
                </div>
            </div>
        </div>


    );
};

export default Overview;
