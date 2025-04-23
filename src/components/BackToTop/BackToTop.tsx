"use client";

import { useEffect, useState } from "react";
import styles from "./BackToTop.module.scss";
import { ArrowUp } from "lucide-react";

export default function BackToTop() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            setVisible(window.scrollY > 300);
        };

        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <button
            onClick={scrollToTop}
            className={`${styles.backToTop} ${visible ? styles.visible : ""}`}
            aria-label="Remonter en haut"
        >
            <ArrowUp size={24} />
        </button>
    );
}
