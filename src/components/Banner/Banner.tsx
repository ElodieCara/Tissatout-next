"use client"; // Si tu es dans `app/`, Next.js 13+

import { useEffect, useState } from "react";
import Image from "next/image";
import Button from "@/components/Button/Button";

interface BannerProps {
    src: string;
    title: string;
    description: string;
}

export default function Banner({ src, title, description }: BannerProps) {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) return null; // Empêche le rendu serveur

    const scrollToSection = (id: string) => {
        const section = document.getElementById(id);
        if (section) {
            section.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <header className="nos-univers__banner">
            <div className="nos-univers__banner-image">
                <Image
                    src={src}
                    alt={title}
                    fill
                    priority
                    sizes="100vw"
                    style={{ objectFit: "cover" }}
                />
            </div>
            <div className="nos-univers__banner-content">
                <h1>{title}</h1>
                <p>{description}</p>
                <div className="nos-univers__banner-content-buttons">
                    <Button className="large" onClick={() => scrollToSection("univers")}>🌟 Par Âge</Button>
                    <Button className="large" onClick={() => scrollToSection("trivium")}>🎓 Trivium</Button>
                    <Button className="large" onClick={() => scrollToSection("interets")}>🎭 Centres d’Intérêt</Button>
                </div>
            </div>
        </header>
    );
}
