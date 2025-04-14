"use client";
import { useEffect, useState } from "react";

function LessonStatusToggle({ slug }: { slug: string }) {
    const key = `lesson-status-${slug}`;
    const [status, setStatus] = useState<"understood" | "toreview" | null>(null);

    useEffect(() => {
        const saved = localStorage.getItem(key);
        if (saved === "understood" || saved === "toreview") {
            setStatus(saved);
        }
    }, [key]);

    const handleClick = (newStatus: "understood" | "toreview") => {
        localStorage.setItem(key, newStatus);
        setStatus(newStatus);
    };

    return (
        <div className="lesson-status">
            <p className="lesson-status__label">📌 Statut de la leçon :</p>
            <div className="lesson-status__buttons">
                <button
                    className={`lesson-status__btn ${status === "understood" ? "active" : ""}`}
                    onClick={() => handleClick("understood")}
                >
                    ✅ J’ai compris
                </button>
                <button
                    className={`lesson-status__btn ${status === "toreview" ? "active" : ""}`}
                    onClick={() => handleClick("toreview")}
                >
                    🔄 À revoir
                </button>
            </div>
        </div>
    );
}

export default LessonStatusToggle;
