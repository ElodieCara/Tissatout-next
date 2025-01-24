import { useState } from "react";
import { sections } from "@/data/home";

const Overview: React.FC = () => {
    const [content, setContent] = useState(sections[0].title);
    const [cardImage, setCardImage] = useState(sections[0].imageCard);

    const handleSidebarClick = (section: typeof sections[0]) => {
        setContent(section.title);
        setCardImage(section.imageCard);
    };

    return (
        <div className="container__section">
            <div className="container__section__card-1">
                <ul className="container__section__card-1__sidebar">
                    {sections.map((section, index) => (
                        <li
                            key={index}
                            className={`container__section__card-1__sidebar__button container__section__card-1__sidebar__button--${section.title
                                .replace(/\s+/g, "")
                                .toLowerCase()}`}
                            style={{
                                backgroundImage: `url(${section.buttonImage.src})`, // Utilisation de .src pour les images importées
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
                <div className="container__section__card-2__content-panel">
                    <div className="container__section__card-2__content-panel__text">
                        <h3>{content}</h3>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                            eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        </p>
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
