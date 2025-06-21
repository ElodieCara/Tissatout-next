"use client";
import Image from "next/image";
import { ReactNode } from "react";
import Button from "../Button/Button";
import FloatingIcons from "../FloatingIcon/FloatingIcons";

interface SectionIntroProps {
    title: string;
    description: string;
    imageSrc: string;
    iconSrc?: string;
    backgroundColor?: string;
    type?: string;
    children?: ReactNode;
}

export default function SectionIntro({
    title,
    description,
    imageSrc,
    iconSrc,
    backgroundColor = "#2c3f64", // par défaut bleu sombre
    type,
    children,
}: SectionIntroProps) {
    const redirectionMap: Record<string, string> = {
        trivium: "/trivium",
        quadrivium: "/quadrivium",
        conseils: "/inspiration",
        idees: "/inspiration",
        coloriages: "/coloriages",
        articles: "/inspiration",
    };

    return (
        <section className="section-intro"
            style={{ backgroundColor }}>
            <div className="section-intro__content">
                <div className="section-intro__text">
                    <div className="section-intro__title">
                        {/* {iconSrc && <img src={iconSrc} alt="" className="section-intro__icon" />} */}
                        <h1 dangerouslySetInnerHTML={{ __html: title.replace(/\n/g, "<br/>") }} />
                    </div>
                    <p>{description}</p>
                    {children}
                    {type && redirectionMap[type] && (
                        <Button href={redirectionMap[type]} className="large">
                            Voir plus
                        </Button>
                    )}
                </div>
                <div className="section-intro__image">
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
                    <Image
                        src={imageSrc}
                        alt="Illustration"
                        width={450}
                        height={400}
                        priority
                        style={{ objectFit: "contain" }}
                    />
                </div>
            </div>
        </section>
    );
}
