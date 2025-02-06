import Button from "../Button/Button";
import Image, { StaticImageData } from "next/image";

type CardProps = {
    cover: string | StaticImageData;
    title: string;
    content: string;
    type: "large" | "small";
    buttonColor?: "yellow-button" | "blue-button"; // ✅ Permet de forcer une couleur
};

const Card: React.FC<CardProps> = ({ cover, title, content, type, buttonColor }) => {
    return (
        <div className="card">
            <div className="card__image">
                <Image className="img" src={cover} alt={title} width={300} height={200} />
            </div>
            <div className="card__content">
                <h3>{title}</h3>
                <p>{content}</p>
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
