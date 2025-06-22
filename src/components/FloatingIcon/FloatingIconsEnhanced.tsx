// components/FloatingIcon/FloatingIcons.tsx
"use client";

import { useEffect, useState, CSSProperties } from "react";

interface Star {
    id: number;
    style: CSSProperties;
}

export default function FloatingIconsEnhanced() {
    const [stars, setStars] = useState<Star[]>([]);

    useEffect(() => {
        const count = 40;
        const generated: Star[] = [];
        for (let i = 0; i < count; i++) {
            // position aléatoire partout
            const topPct = Math.random() * 100;
            const leftPct = Math.random() * 100;

            // plus gros en haut (topPct petit -> size grand)
            const size = 4 + (1 - topPct / 100) * 16 + Math.random() * 4;

            // délai d’animation aléatoire
            const delay = (Math.random() * 2).toFixed(2) + "s";

            generated.push({
                id: i,
                style: {
                    position: "absolute",
                    top: `${topPct.toFixed(1)}%`,
                    left: `${leftPct.toFixed(1)}%`,
                    width: `${size.toFixed(1)}px`,
                    height: `${size.toFixed(1)}px`,
                    animationDelay: delay,
                    // on peut ajouter ici zIndex: 0 si besoin
                },
            });
        }
        setStars(generated);
    }, []);

    return (
        <div className="floating-icons" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
            {stars.map(({ id, style }) => (
                <span key={id} className="floating-icon pop-star" style={style}>
                    <svg
                        viewBox="0 0 100 100"
                        width={style.width as string}
                        height={style.height as string}
                        fill="#ffdc33"
                        style={{ filter: "drop-shadow(0 0 4px #fff3b5)" }}
                    >
                        <path d="M50 0 Q60 45, 100 50 Q60 55, 50 100 Q40 55, 0 50 Q40 45, 50 0 Z" />
                    </svg>
                </span>
            ))}
        </div>
    );
}
