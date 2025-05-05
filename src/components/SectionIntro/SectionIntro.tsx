"use client";
import Image from "next/image";
import { ReactNode } from "react";

interface SectionIntroProps {
    title: string;
    description: string;
    imageSrc: string;
    iconSrc?: string;
    backgroundColor?: string;
    children?: ReactNode;
}

export default function SectionIntro({
    title,
    description,
    imageSrc,
    iconSrc,
    backgroundColor = "#2c3f64", // par défaut bleu sombre
    children,
}: SectionIntroProps) {
    return (
        <section className="section-intro"
            style={{ backgroundColor }}>
            <div className="section-intro__content">
                <div className="section-intro__text">
                    <div className="section-intro__title">
                        {iconSrc && <img src={iconSrc} alt="" className="section-intro__icon" />}
                        <h1 dangerouslySetInnerHTML={{ __html: title.replace(/\n/g, "<br/>") }} />
                    </div>
                    <p>{description}</p>
                    {children}
                </div>
                <div className="section-intro__image">
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
