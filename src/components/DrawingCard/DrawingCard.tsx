import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // ✅ Récupère l'URL actuelle

interface DrawingCardProps {
    id: string;
    imageUrl: string;
    theme: string;
    views?: number;
    likeCount?: number;
    showLikes?: boolean;
    showViews?: boolean;
    showButton?: boolean;
}

export default function DrawingCard({
    id,
    imageUrl,
    theme,
    views = 0,
    likeCount = 0,
    showLikes = true,
    showViews = true,
    showButton = true
}: DrawingCardProps) {
    const [localLikeCount, setLocalLikeCount] = useState(likeCount);
    const [liked, setLiked] = useState(false);
    const pathname = usePathname(); // ✅ Récupère l'URL actuelle
    const isDetailPage = pathname === `/coloriages/${id}`; // ✅ Vérifie si c'est la page détaillée

    const handleLike = async (e: React.MouseEvent) => {
        e.preventDefault(); // 🔥 Empêche le clic sur la carte de changer de page

        if (liked || !isDetailPage) return; // 🔥 Bloque le like si ce n'est pas la page détaillée

        try {
            const res = await fetch("/api/drawings/like", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });

            if (!res.ok) throw new Error("Échec du like");

            const data = await res.json();
            setLocalLikeCount(data.likes);
            setLiked(true);
        } catch (error) {
            console.error("❌ Erreur lors du like :", error);
        }
    };

    return (
        <div className="drawing-card">
            <Link href={`/coloriages/${id}`}>
                <div className="drawing-card__image-link">
                    <Image
                        src={imageUrl}
                        alt={theme}
                        width={300}
                        height={200}
                        className="drawing-card__image"
                        priority={true}
                    />
                </div>
                <div className="drawing-card__content">
                    <h3 className="drawing-card__content-theme">{theme}</h3>
                    {showViews && <p className="drawing-card__content-views">👀 {views} vues</p>}
                </div>
            </Link>

            {showLikes && (
                <button
                    className={`drawing-card__like-button ${liked ? "liked" : ""}`}
                    onClick={handleLike}
                    disabled={!isDetailPage} // ✅ Désactive le bouton en dehors de la page détaillée
                >
                    ❤️ {localLikeCount}
                </button>
            )}
            {showButton && (
                <Link href={`/coloriages/${id}`} legacyBehavior>
                    <a className="drawing-button">Voir le coloriage</a>
                </Link>
            )}
        </div>
    );
}
