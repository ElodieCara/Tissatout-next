"use client";
import { useEffect, useState } from "react";

export default function LessonStatusBadge({ slug }: { slug: string }) {
    const [status, setStatus] = useState<"understood" | "toreview" | null>(null);

    useEffect(() => {
        const saved = localStorage.getItem(`lesson-status-${slug}`);
        if (saved === "understood" || saved === "toreview") {
            setStatus(saved);
        }
    }, [slug]);

    if (!status) return null;

    return (
        <span className={`lesson-status-badge lesson-status-badge--${status}`}>
            {status === "understood" ? "✅ Compris" : "🔁 À revoir"}
        </span>
    );
}
