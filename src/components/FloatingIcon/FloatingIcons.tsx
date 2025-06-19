// components/FloatingIcon/FloatingIcons.tsx
"use client";

import { useEffect, useState, CSSProperties } from "react";

const FIXED_POSITIONS: Pick<CSSProperties, "top" | "left">[] = [
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

interface Star {
    id: number;
    style: CSSProperties;
}

export default function FloatingIcons() {
    const [stars, setStars] = useState<Star[] | null>(null);

    // On ne rend rien en SSR pour éviter le mismatch
    useEffect(() => {
        const generated = FIXED_POSITIONS.map((pos, i) => {
            const size = Math.floor(Math.random() * 8) + 10;     // 10–17px
            const delay = (Math.random() * 2).toFixed(2) + "s"; // 0.00–2.00s

            return {
                id: i,
                style: {
                    position: "absolute",
                    top: pos.top,
                    left: pos.left,
                    width: `${size}px`,
                    height: `${size}px`,
                    animationDelay: delay,
                } as CSSProperties,
            };
        });
        setStars(generated);
    }, []);

    if (!stars) return null;

    return (
        <div className="floating-icons">
            {stars.map(({ id, style }) => (
                <span key={id} className="floating-icon pop-star" style={style}>
                    <svg
                        viewBox="0 0 100 100"
                        width={style.width as string}
                        height={style.height as string} fill="#ffdc33"
                        style={{ filter: "drop-shadow(0 0 4px #fff3b5)" }}
                    >
                        <path d="M50 0 Q60 45, 100 50 Q60 55, 50 100 Q40 55, 0 50 Q40 45, 50 0 Z" />
                    </svg>
                </span>
            ))}
        </div>
    );
}
