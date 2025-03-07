import Image from "next/image";
import { useState } from "react";
import Link from "next/link";

interface DrawingCardProps {
    id: string;
    imageUrl: string;
    theme: string;
    views?: number;
    likeCount?: number;
}

export default function DrawingCard({ id, imageUrl, theme, views = 0, likeCount = 0 }: DrawingCardProps) {
    const [localLikeCount, setLocalLikeCount] = useState(likeCount);

    const handleLike = async () => {
        try {
            const res = await fetch("/api/drawings/like", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });

            if (!res.ok) throw new Error("Échec du like");

            const data = await res.json();
            setLocalLikeCount(data.likes);
        } catch (error) {
            console.error("❌ Erreur lors du like :", error);
        }
    };

    return (
        <div className="drawing-card">
            <Link href={`/coloriages/${id}`} legacyBehavior>
                <a className="drawing-card__image-link">
                    <Image
                        src={imageUrl}
                        alt={theme}
                        width={300}
                        height={200}
                        className="drawing-card__image"
                    />
                </a>
            </Link>
            <div className="drawing-card__content">
                <h3 className="drawing-card__content-theme">{theme}</h3>
                {views > 0 && <p className="drawing-card__content-views">{views} vues</p>}
                {localLikeCount > 0 && <p>❤️ {localLikeCount} likes</p>}
                <button onClick={handleLike} className="drawing-like-button">❤️ Liker</button>
                <Link href={`/coloriages/${id}`} legacyBehavior>
                    <a className="drawing-button">Voir le coloriage</a>
                </Link>
            </div>
        </div>
    );
}