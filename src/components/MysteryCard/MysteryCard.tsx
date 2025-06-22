"use client";
import React from "react";
import { useRouter } from "next/navigation";

interface MysteryCardProps {
    title: string;
    description: string;
    imageSrc: string;
    alt: string;
    primaryButtonText: string;
    primaryButtonLink: string;
    secondaryButtonText: string;
    secondaryButtonLink: string;
}

const MysteryCard: React.FC<MysteryCardProps> = ({
    title,
    description,
    imageSrc,
    alt,
    primaryButtonText,
    primaryButtonLink,
    secondaryButtonText,
    secondaryButtonLink,
}) => {
    const router = useRouter();

    return (
        <section className="activity-mystery">
            <div className="activity-mystery__content">
                <h2 className="activity-mystery__title">{title}</h2>
                <p className="activity-mystery__text">{description}</p>
                <div className="activity-mystery__buttons">
                    <button
                        className="btn btn--primary"
                        onClick={() => router.push(primaryButtonLink)}
                    >
                        {primaryButtonText}
                    </button>
                    <button
                        className="btn btn--secondary"
                        onClick={() => router.push(secondaryButtonLink)}
                    >
                        {secondaryButtonText}
                    </button>
                </div>
            </div>

            <div className="activity-mystery__image">
                <img src={imageSrc} alt={alt} />
            </div>
        </section>
    );
};

export default MysteryCard;
