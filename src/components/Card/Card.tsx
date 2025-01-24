import Button from "../Button/Button";
import Image, { StaticImageData } from "next/image";

type CardProps = {
    cover: string | StaticImageData; // URL de l'image ou image statique, requis
    title: string; // Titre de la carte, requis
    content: string; // Contenu de la carte, requis
    type: "large" | "small"; // Taille de la carte, requis (valeurs limitées)
};

const Card: React.FC<CardProps> = ({ cover, title, content, type }) => {
    return (
        <div className="card">
            <div className="card__image">
                <Image className="img" src={cover} alt={title} width={300} height={200} />
            </div>
            <div className="card__content">
                <h3>{title}</h3>
                <p>{content}</p>
                <div className="card__content__actions">
                    <Button className={`card__content__actions__button ${type}`}>
                        En savoir plus
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Card;
