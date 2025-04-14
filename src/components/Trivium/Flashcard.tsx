// src/components/Flashcard/Flashcard.tsx
"use client";

import { useState } from "react";
import "./Flashcard.scss";

export default function Flashcard({ front, back }: { front: string; back: string }) {
    const [flipped, setFlipped] = useState(false);

    return (
        <div
            className={`flashcard ${flipped ? "is-flipped" : ""}`}
            onClick={() => setFlipped(!flipped)}
        >
            <div className="flashcard__inner">
                <div className="flashcard__front">{front}</div>
                <div className="flashcard__back">{back}</div>
            </div>
        </div>
    );
}
