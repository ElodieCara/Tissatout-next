"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/Button/Button";
import FloatingIcons from "../FloatingIcon/FloatingIcons";

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
    const [showQuickAccess, setShowQuickAccess] = useState(false);

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
        <>
            <div className={`nos-univers__banner ${className ?? ""}`}>

                <div className="nos-univers__banner-content">
                    <div className="nos-univers__banner-content__bloc">
                        <div className="nos-univers__banner-content__text"> <h1>{title}</h1>
                            <p className="nos-univers__banner-content__description-bubble">{description}</p>
                        </div>

                        <div className="nos-univers__banner-image">
                            <FloatingIcons />
                            <div className="background-flare">
                                <img src="/bg/bg-flare-tissatout.png" alt="Background Flare" />
                                {/* ✨ Étoiles scintillantes */}
                                <div className="twinkle star-1"></div>
                                <div className="twinkle star-2"></div>
                                <div className="twinkle star-3"></div>
                                <div className="twinkle star-4"></div>
                                <div className="twinkle star-5"></div>
                            </div>
                            <div className="background-image" style={{ position: "relative", width: "100%", aspectRatio: "2 / 1" }}>
                                <Image
                                    src={src}
                                    alt={title}
                                    fill
                                    priority
                                    sizes="100vw"
                                    style={{ objectFit: "contain" }}
                                />
                            </div>
                        </div>
                    </div>



                    {/* Version desktop : gros boutons */}
                    {buttons.length > 0 && (
                        <div className="nos-univers__banner-content-buttons">
                            {buttons.map((button, index) =>
                                button.href ? (
                                    <Link key={index} href={button.href} passHref>
                                        <Button className="large">{button.label}</Button>
                                    </Link>
                                ) : (
                                    <Button
                                        key={index}
                                        className="large"
                                        onClick={() => scrollToSection(button.targetId!)}
                                    >
                                        {button.label}
                                    </Button>
                                )
                            )}
                        </div>
                    )}
                </div>

            </div>
            {/* ✅ Barre fixe mobile (simple, sans bug) */}
            <div className="quickbar">
                <Link href="/coloriages/explorer">
                    <button className="tous">
                        <span>Tous</span>
                    </button>
                </Link>
                <button className="age" onClick={() => scrollToSection("ages")}>
                    <span>Âge</span>
                </button>
                <button className="themes" onClick={() => scrollToSection("themes")}>
                    <span>Thèmes</span>
                </button>
                <button className="educ" onClick={() => scrollToSection("educatif")}>
                    <span>Éduc</span>
                </button>
            </div>

        </>
    );
}
