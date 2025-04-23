// components/LikeButton.tsx
"use client";

import { useState, useEffect } from "react";

interface LikeButtonProps {
    id: string;
}

export default function LikeButton({ id }: LikeButtonProps) {
    const [likes, setLikes] = useState<number>(0);
    const [liked, setLiked] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem(`printable_like_${id}`);
        if (saved) {
            setLiked(true);
            setLikes(parseInt(saved, 10));
        }
    }, [id]);

    const handleLike = async () => {
        if (liked) return;

        const newLikes = likes + 1;
        setLikes(newLikes);
        setLiked(true);
        localStorage.setItem(`printable_like_${id}`, newLikes.toString());

        await fetch("/api/printables/like", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
        });
    };

    return (
        <button onClick={handleLike} className="like-button" aria-label="J’aime">
            <span className={`like-icon ${liked ? "liked" : ""}`}>
                {liked ? "❤️" : "🤍"}
            </span>
            <span className="like-count">{likes}</span>
        </button>
    );
}
