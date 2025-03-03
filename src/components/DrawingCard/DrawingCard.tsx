import Image from "next/image";

interface DrawingCardProps {
    imageUrl: string;
    theme: string;
    views: number;
}

export default function DrawingCard({ imageUrl, theme, views }: DrawingCardProps) {
    return (
        <div className="drawing-card">
            <Image
                src={imageUrl}
                alt={theme}
                width={300}
                height={200}
                className="drawing-card__image"
            />
            <div className="drawing-card__content">
                <h3 className="drawing-card__content-theme">{theme}</h3>
                <p className="drawing-card__content-views">{views} vues</p>
            </div>
        </div>
    );
}
