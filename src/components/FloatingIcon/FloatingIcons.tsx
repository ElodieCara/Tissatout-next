"use client";
import { useEffect, useState, CSSProperties } from "react";

const ICONS = ["⭐", "🎵", "🎶", "✨", "🌟", "🦋", "🎈", "🎀", "💫", "🧸"];

const FIXED_POSITIONS: CSSProperties[] = [
    { top: "5%", left: "10%" },
    { top: "10%", left: "80%" },
    { top: "15%", left: "20%" },
    { top: "20%", left: "90%" },
    { top: "25%", left: "75%" },
    { top: "30%", left: "5%" },
    { top: "35%", left: "15%" },
    { top: "40%", left: "85%" },
    { top: "45%", left: "75%" },
    { top: "50%", left: "5%" },
    { top: "55%", left: "13%" },
    { top: "60%", left: "80%" },
    { top: "65%", left: "20%" },
    { top: "70%", left: "90%" },
    { top: "75%", left: "85%" },
    { top: "80%", left: "20%" },
    { top: "85%", left: "10%" },
    { top: "90%", left: "80%" },
    { top: "95%", left: "15%" },
];

export default function FloatingIcons() {
    const [height, setHeight] = useState<number>(1000); // 🔥 Typage explicite

    useEffect(() => {
        const wrapper = document.querySelector(".nos-univers__categories-wrapper");
        if (wrapper) {
            setHeight(wrapper.scrollHeight);
        }
    }, []);

    const icons = FIXED_POSITIONS.map((pos, i) => ({
        id: i,
        style: {
            ...pos,
            fontSize: 35, // ✅ Nombre au lieu de string
            color: ["#FFD700", "#FF4500", "#32CD32", "#1E90FF", "#FF69B4"][i % 5],
            opacity: 0.9,
            position: "absolute" as const, // ✅ Corrige l'erreur TypeScript
        } as CSSProperties, // ✅ Force le type CSSProperties
        icon: ICONS[i % ICONS.length],
    }));

    return (
        <div className="floating-icons" style={{ height: `${height}px` }}>
            {icons.map(({ id, style, icon }) => (
                <span key={id} className="floating-icon" style={style}>
                    {icon}
                </span>
            ))}
        </div>
    );
}
