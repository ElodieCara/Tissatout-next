"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // ✅ Récupère l'URL actuelle

interface DrawingCardProps {
    id: string;
    slug: string;
    imageUrl: string;
    theme: string;
    views?: number;
    likeCount?: number;
    showLikes?: boolean;
    showViews?: boolean;
    showButton?: boolean;
    isNew?: boolean;
}

export default function DrawingCard({
    id,
    slug,
    imageUrl,
    theme,
    views = 0,
    likeCount = 0,
    showLikes = true,
    showViews = true,
    showButton = true,
    isNew = false,
}: DrawingCardProps) {
    const [localLikeCount, setLocalLikeCount] = useState(likeCount);
    const [liked, setLiked] = useState(false);
    const pathname = usePathname(); // ✅ Récupère l'URL actuelle
    console.log("🔍 URL actuelle :", pathname); // ✅ Debug

    const truncatedId = id.substring(0, 6);
    const pageSlug = `${slug}-${truncatedId}`;
    const isDetailPage = pathname === `/coloriages/${pageSlug}`;
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
            {isNew && <span className="drawing-card__badge">Nouveau</span>}
            <Link href={`/coloriages/${pageSlug}`}>
                <div className="drawing-card__link">
                    <Image
                        src={imageUrl}
                        alt={theme}
                        width={180}
                        height={180}
                        className="drawing-card__link-image"
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
                <Link href={`/coloriages/${pageSlug}`} className="drawing-button">
                    Voir le coloriage
                </Link>
            )}
        </div>
    );
}
