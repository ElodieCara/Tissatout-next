import Image from "next/image";
import { useState } from "react";

interface DrawingCardProps {
    id: string;
    imageUrl: string;
    theme: string;
    views: number;
    likes: number;
}

export default function DrawingCard({ id, imageUrl, theme, views, likes }: DrawingCardProps) {
    const [likeCount, setLikeCount] = useState(likes);

    const handleLike = async () => {
        try {
            const res = await fetch("/api/drawings/like", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });

            if (!res.ok) throw new Error("Échec du like");

            const data = await res.json();
            setLikeCount(data.likes);
        } catch (error) {
            console.error("❌ Erreur lors du like :", error);
        }
    };

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
                <p>❤️ {likeCount} likes</p>
                <button onClick={handleLike}>❤️ Liker</button>
            </div>
        </div>
    );
}
