"use client";


import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import FloatingIconsEnhanced from "../FloatingIcon/FloatingIconsEnhanced";

interface MysteryCardProps {
    title: string;
    description: string;
    imageSrc: string;
    alt: string;
    isRevealed: boolean;
    revealDate: string;
    isSubscribed?: boolean;
    primaryButtonLink: string;
    secondaryButtonLink: string;
}

const MysteryCard: React.FC<MysteryCardProps> = ({
    title,
    description,
    imageSrc,
    alt,
    revealDate,
    isSubscribed,
    primaryButtonLink,
    secondaryButtonLink,
}) => {
    const router = useRouter();
    const [isRevealed, setIsRevealed] = useState(false);

    useEffect(() => {
        const now = new Date();
        const reveal = new Date(revealDate);

        if (now >= reveal) {
            setIsRevealed(true);
        } else {
            const timeout = reveal.getTime() - now.getTime();
            const timer = setTimeout(() => {
                setIsRevealed(true);
            }, timeout);
            return () => clearTimeout(timer);
        }
    }, [revealDate]);

    return (
        <section className="mystery">
            <div className="activity-mystery" style={{
                background: 'linear-gradient(135deg, #529393 0%, #c4c39d  100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                width: '100%',

            }}>
                <FloatingIconsEnhanced />
                <div className="activity-mystery__content">
                    <h2 className="activity-mystery__title">{title}</h2>
                    <p className="activity-mystery__text">{description}</p>

                    <div className="activity-mystery__buttons">
                        {isRevealed ? (
                            <button
                                className="btn btn--primary"
                                onClick={() => router.push(primaryButtonLink)}
                            >
                                Voir l'activité mystérieuse
                            </button>
                        ) : (
                            <button className="btn btn--primary btn--disabled" disabled>
                                ⏳ Révélation le {new Date(revealDate).toLocaleString("fr-FR")}
                            </button>
                        )}
                        <button
                            className="btn btn--secondary"
                            onClick={() => router.push("/subscribe")}
                        >
                            {isSubscribed ? "Ajouter à mes rappels" : "S’inscrire"}
                        </button>
                    </div>
                </div>

                <div className="activity-mystery__image">
                    <img
                        src="/icons/theatre.png"
                        alt="Mystère"
                        width={100}
                        height={100}
                        // style={{ verticalAlign: "middle" }}
                        style={{ pointerEvents: 'none', transform: "scale(1.2)", transition: "transform .3s" }}
                    />
                </div>
            </div>
        </section >
    );
};

export default MysteryCard;
