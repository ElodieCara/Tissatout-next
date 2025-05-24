"use client";
import { useEffect, useState } from "react";
import Image from "next/image";


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
            <p className="lesson-status__label">
                <Image
                    src="/icons/punaise.png"
                    alt=""
                    width={18}
                    height={18}
                    className="lesson-status__icon"
                    aria-hidden="true"
                />
                Statut de la leçon :
            </p>
            <div className="lesson-status__buttons">
                <button
                    className={`lesson-status__btn ${status === "understood" ? "active" : ""}`}
                    onClick={() => handleClick("understood")}
                    aria-label="J’ai compris"
                >
                    <Image src="/icons/compris.png" alt="J’ai compris" width={32} height={32} />
                </button>
                <button
                    className={`lesson-status__btn ${status === "toreview" ? "active" : ""}`}
                    onClick={() => handleClick("toreview")} aria-label="À revoir"
                >
                    <Image src="/icons/arevoir.png" alt="À revoir" width={32} height={32} />
                </button>
            </div>
        </div>
    );
}

export default LessonStatusToggle;
