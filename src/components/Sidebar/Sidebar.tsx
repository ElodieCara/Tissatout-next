"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Sidebar({ categories }: { categories: Record<string, string[]> }) {
    const [activeSection, setActiveSection] = useState("");

    useEffect(() => {
        const handleScroll = () => {
            const sections = Object.keys(categories).map(cat => document.getElementById(cat.replace(/\s+/g, "-").toLowerCase()));
            const scrollPosition = window.scrollY + 150;

            for (const section of sections) {
                if (section && section.offsetTop <= scrollPosition) {
                    setActiveSection(section.id);
                }
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [categories]);

    return (
        <nav className="sidebar">
            <h3>📜 Sommaire</h3>
            <ul>
                {Object.keys(categories).map((category) => {
                    const id = category.replace(/\s+/g, "-").toLowerCase();
                    return (
                        <li key={id} className={activeSection === id ? "active" : ""}>
                            <Link href={`#${id}`}>{category}</Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
