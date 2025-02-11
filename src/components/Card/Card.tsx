import Button from "../Button/Button";
import Image, { StaticImageData } from "next/image";

type CardProps = {
    cover: string | StaticImageData;
    title: string;
    content: string;
    category?: string;
    iconSrc?: string;
    tags?: string[];
    type: "large" | "small";
    buttonColor?: "yellow-button" | "blue-button"; // ✅ Permet de forcer une couleur
};

const Card: React.FC<CardProps> = ({ cover, title, content, type, category, tags, iconSrc, buttonColor }) => {
    return (
        <div className="card">
            <div className="card__image">
                <Image className="img" src={cover} alt={title} width={300} height={200} quality={100} />
                {/* Icône de la catégorie en overlay sur l'image */}
                {iconSrc && (
                    <div className="card__icon">
                        <Image src={iconSrc} alt={category || "Icône"} width={40} height={40} unoptimized />
                    </div>
                )}
            </div>
            <div className="card__content">
                <div className="card__content__text">
                    <h3>{title}</h3>

                    {/* <p className="card__content__description">{content}</p> */}

                    {/* ✅ Affichage des tags */}
                    {tags && tags.length > 0 && (
                        <div className="card__content__tags">
                            {tags.map((tag, index) => (
                                <span key={index} className="card__content__tags__tag">{tag}</span>
                            ))}
                        </div>
                    )}

                    <p>{content}</p>
                </div>
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
