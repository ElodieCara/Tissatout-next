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
                <Button className="large" onClick={() => console.log("Action à définir")}>
                    Découvrir les univers
                </Button>
            </div>
        </header>
    );
}
