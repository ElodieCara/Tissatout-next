"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function LessonStatusBadge({ slug }: { slug: string }) {
    const [status, setStatus] = useState<"understood" | "toreview" | null>(null);

    useEffect(() => {
        const saved = localStorage.getItem(`lesson-status-${slug}`);
        if (saved === "understood" || saved === "toreview") {
            setStatus(saved);
        }
    }, [slug]);

    if (!status) return null;

    const iconSrc = status === "understood" ? "/icons/compris.png" : "/icons/arevoir.png";
    const altText = status === "understood" ? "Leçon comprise" : "À revoir";

    return (
        <span className={`lesson-status-badge lesson-status-badge--${status}`} role="img" aria-label={altText}>
            <Image
                src={iconSrc}
                alt={altText}
                width={20}
                height={20}
                style={{ display: "block" }}
            />
        </span>
    );
}
