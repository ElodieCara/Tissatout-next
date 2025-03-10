"use client";

import { useState } from "react";
import Image from "next/image";

interface DrawingDetailCardProps {
    id: string;
    imageUrl: string;
    title: string;
    likes: number;
}

export default function DrawingDetailCard({ id, imageUrl, title, likes }: DrawingDetailCardProps) {
    const [localLikes, setLocalLikes] = useState(likes);
    const [liked, setLiked] = useState(false);

    const handleLike = async () => {
        if (liked) return; // Empêche le spam des likes

        try {
            const res = await fetch("/api/drawings/like", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });

            if (!res.ok) throw new Error("Échec du like");

            const data = await res.json();
            setLocalLikes(data.likes);
            setLiked(true);
        } catch (error) {
            console.error("❌ Erreur lors du like :", error);
        }
    };

    return (
        <div className="drawing-detail">
            {/* ✅ Image du coloriage */}
            <Image
                src={imageUrl}
                alt={title}
                width={500} // Image plus grande
                height={500}
                className="drawing-detail__image"
                priority
            />

            {/* ✅ Icône de like */}
            <button
                className={`drawing-detail__like-button ${liked ? "liked" : ""}`}
                onClick={handleLike}
            >
                ❤️ {localLikes}
            </button>

            {/* ✅ Titre du coloriage */}
            <h2 className="drawing-detail__title">{title}</h2>
        </div>
    );
}
