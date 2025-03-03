"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Button from "@/components/Button/Button";

interface ButtonProps {
    label: string;
    targetId: string;
}

interface BannerProps {
    src: string;
    title: string;
    description: string;
    buttons?: ButtonProps[]; // Permet de passer une liste de boutons dynamiques
}

export default function Banner({ src, title, description, buttons = [] }: BannerProps) {
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
        <div className="nos-univers__banner">
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

                {/* ✅ Afficher les boutons dynamiques uniquement s'ils sont définis */}
                {buttons.length > 0 && (
                    <div className="nos-univers__banner-content-buttons">
                        {buttons.map((button, index) => (
                            <Button
                                key={index}
                                className="large"
                                onClick={() => scrollToSection(button.targetId)}
                            >
                                {button.label}
                            </Button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
