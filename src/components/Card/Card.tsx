import Button from "../Button/Button";
import Image, { StaticImageData } from "next/image";


type CardProps = {
    cover: string | StaticImageData;
    title: string;
    content: string;
    date?: string;
    category?: string;
    iconSrc?: string;
    tags?: string[];
    type: "large" | "small";
    buttonColor?: "yellow-button" | "blue-button";
    className?: string;
};

const Card: React.FC<CardProps> = ({ cover, title, content, date, type, category, tags, iconSrc, buttonColor, className }) => {
    return (
        <div className={`card ${className ? className : ""}`}> {/* ✅ Permet d'injecter des styles dynamiques */}

            {/* ✅ Icône de catégorie en haut à gauche */}
            {iconSrc && (
                <div className="card__icon">
                    <Image src={iconSrc} alt={category || "Icône"} width={30} height={30} priority={true} />
                </div>
            )}

            {/* ✅ Image principale */}
            <div className="card__image">
                <Image src={cover} alt={title} width={300} height={200} quality={100} priority={true} />
            </div>

            {/* ✅ Contenu de la carte */}
            <div className="card__content">
                <div className="card__content__text">
                    <h3 className="card__content__text__title">{title}</h3>
                    <p className="card__content__text__description">{content}</p>
                    {date && <p className="card__content__text__date"> {new Date(date).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                    })}</p>}
                </div>

                {/* ✅ Affichage des tags */}
                {tags && tags.length > 0 && (
                    <div className="card__content__tags">
                        {tags.map((tag, index) => (
                            <span key={index}>{tag}</span>
                        ))}
                    </div>
                )}

                {/* ✅ Bouton */}
                <div className="card__content__actions">
                    <Button className={`card__content__actions__button ${buttonColor ?? (type === "large" ? "yellow-button" : "blue-button")}`}>
                        En savoir plus
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Card;
