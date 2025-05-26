"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/Button/Button";

interface ButtonProps {
    label: React.ReactNode;
    targetId?: string; // Optionnel pour les ancres internes
    href?: string; // Optionnel pour la redirection externe
}

interface BannerProps {
    src: string;
    title: string;
    description: string;
    buttons?: ButtonProps[]; // Permet de passer une liste de boutons dynamiques
    className?: string;
}

export default function Banner({ src, title, description, buttons = [], className }: BannerProps) {
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
        <div className={`nos-univers__banner ${className ?? ""}`}>
            <div className="nos-univers__banner-content">
                <h1>{title}</h1>
                <p>{description}</p>

                {/* ✅ Afficher les boutons dynamiques uniquement s'ils sont définis */}
                {buttons.length > 0 && (
                    <div className="nos-univers__banner-content-buttons">
                        {buttons.map((button, index) =>
                            button.href ? (
                                <Link key={index} href={button.href} passHref>
                                    <Button className="large">{button.label}</Button>
                                </Link>
                            ) : (
                                <Button key={index} className="large" onClick={() => scrollToSection(button.targetId!)}>
                                    {button.label}
                                </Button>
                            )
                        )}
                    </div>
                )}
            </div>
            <div className="nos-univers__banner-image">
                <div className="background-flare">
                    <img src="/bg/bg-flare-tissatout.png" alt="Background Flare" />
                    {/* ✨ Étoiles scintillantes */}
                    <div className="twinkle star-1"></div>
                    <div className="twinkle star-2"></div>
                    <div className="twinkle star-3"></div>
                    <div className="twinkle star-4"></div>
                    <div className="twinkle star-5"></div>
                </div>
                <Image
                    src={src}
                    alt={title}
                    layout="responsive"
                    width={800}
                    height={400}
                    priority
                    sizes="100vw"
                    style={{ objectFit: "contain" }}
                />
            </div>
        </div>
    );
}
