"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { slugify } from "@/lib/slugify";

interface Props {
    sections: { title: string }[];
}

export default function TableOfContents({ sections }: Props) {
    const [isMobile, setIsMobile] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    if (!sections || sections.length === 0) return null;

    const tocList = (
        <ul className="toc__list">
            {sections.map((section) => (
                <li key={section.title} className="toc__item">
                    <Link
                        href={`#${slugify(section.title)}`}
                        className="toc__link"
                        onClick={() => isMobile && setIsOpen(false)}
                    >
                        {section.title}
                    </Link>
                </li>
            ))}
        </ul>
    );

    return (
        <nav className={`toc ${isMobile ? "toc--mobile" : "toc--desktop"}`}>
            {isMobile ? (
                <div className="toc__mobile-header">
                    <button onClick={() => setIsOpen(!isOpen)} className="toc__toggle">
                        {isOpen ? "❌ Fermer" : "📓 Sommaire"}
                    </button>
                    {isOpen && tocList}
                </div>
            ) : (
                <div className="toc__desktop">
                    <h3 className="toc__title">📚 Sommaire
                    </h3>
                    {tocList}
                </div>
            )}
        </nav>
    );
}
